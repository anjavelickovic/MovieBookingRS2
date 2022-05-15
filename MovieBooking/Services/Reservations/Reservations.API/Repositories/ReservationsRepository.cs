using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Reservations.API.Entities;

namespace Reservations.API.Repositories
{
    public class ReservationsRepository : IReservationsRepository
    {
        private readonly IDistributedCache _cache;

        public ReservationsRepository(IDistributedCache cache)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<ReservationBasket> GetReservations(string username)
        {
            var basket = await _cache.GetStringAsync(username);
            if (string.IsNullOrEmpty(basket))
            {
                return null;
            }
            return JsonConvert.DeserializeObject<ReservationBasket>(basket);
        }

        public async Task<Dictionary<string, Reservation>> GetMovieReservations(string username, string movieId)
        {
            var basket = await _cache.GetStringAsync(username);
            if (string.IsNullOrEmpty(basket))
            {
                return null;
            }
            ReservationBasket reservations = JsonConvert.DeserializeObject<ReservationBasket>(basket);
            if (reservations.Reservations.ContainsKey(movieId))
            {
                return reservations.Reservations[movieId];
            }
            return null;
        }

        public async Task<ReservationBasket> AddReservation(string username, Reservation reservation)
        {
            ReservationBasket reservationBasket = await GetReservations(username);
            if (reservationBasket == null)
            {
                reservationBasket = new ReservationBasket(username);
            }

            if (reservationBasket.Reservations.ContainsKey(reservation.MovieId)) 
            {
                if (reservationBasket.Reservations[reservation.MovieId].ContainsKey(reservation.ProjectionId))
                {
                    throw new Exception("Reservations for this projection already exists!");
                }

                reservationBasket.Reservations[reservation.MovieId][reservation.ProjectionId] = reservation;
                
            }
            else
            {
                reservationBasket.Reservations[reservation.MovieId] = new Dictionary<string, Reservation>
                {
                    [reservation.ProjectionId] = reservation
                };
            }

            var basketString = JsonConvert.SerializeObject(reservationBasket);
            await _cache.SetStringAsync(username, basketString);
           
            return await GetReservations(username);
        }

        public async Task<ReservationBasket> UpdateReservations(string username, Reservation reservation)
        {
            ReservationBasket reservationBasket = await GetReservations(username);

            reservationBasket.Reservations[reservation.MovieId][reservation.ProjectionId] = reservation;

            var basketString = JsonConvert.SerializeObject(reservationBasket);
            await _cache.SetStringAsync(username, basketString);

            return await GetReservations(username);
        }

        public async Task DeleteReservations(string username)
        {
            await _cache.RemoveAsync(username);
        }

        public async Task DeleteMovieReservations(string username, string movieId)
        {
            ReservationBasket reservationBasket = await GetReservations(username);
            if (reservationBasket != null && reservationBasket.Reservations.ContainsKey(movieId))
            {
                reservationBasket.Reservations.Remove(movieId);
                var basketString = JsonConvert.SerializeObject(reservationBasket);
                await _cache.SetStringAsync(username, basketString);
            }
        }

        public async Task DeleteReservation(string username, Reservation reservation)
        {
            ReservationBasket reservationBasket = await GetReservations(username);
            reservationBasket.Reservations[reservation.MovieId].Remove(reservation.ProjectionId);
            if(reservationBasket.Reservations[reservation.MovieId].Count == 0)
            {
                reservationBasket.Reservations.Remove(reservation.MovieId);
            }
            var basketString = JsonConvert.SerializeObject(reservationBasket);
            await _cache.SetStringAsync(username, basketString);
        }
    }
}