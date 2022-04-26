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

        public async Task<ReservationBasket> GetAllReservations(string username)
        {
            var basket = await _cache.GetStringAsync(username);
            if (string.IsNullOrEmpty(basket))
            {
                return null;
            }
            return JsonConvert.DeserializeObject<ReservationBasket>(basket);
        }

        public async Task<List<Reservation>> GetMovieReservations(string username, string movieId)
        {
            var basket = await _cache.GetStringAsync(username);
            if (string.IsNullOrEmpty(basket))
            {
                return null;
            }
            ReservationBasket allReservations = JsonConvert.DeserializeObject<ReservationBasket>(basket);
            if (allReservations.Reservations.ContainsKey(movieId))
            {
                return allReservations.Reservations[movieId];
            }
            return null;

        }

        public async Task<ReservationBasket> UpdateReservations(string username, Reservation reservation)
        {
            ReservationBasket reservationBasket = await GetAllReservations(username);
            if (reservationBasket == null)
            {
                ReservationBasket basket = new ReservationBasket(username);
                basket.Reservations[reservation.MovieId] = new List<Reservation>();
                basket.Reservations[reservation.MovieId].Add(reservation);
                var basketString = JsonConvert.SerializeObject(basket);
                await _cache.SetStringAsync(username, basketString);
            }
            else
            {
                if (reservationBasket.Reservations.ContainsKey(reservation.MovieId))
                {
                    reservationBasket.Reservations[reservation.MovieId].Add(reservation);
                }
                else
                {
                    reservationBasket.Reservations[reservation.MovieId]
                        = new List<Reservation>();
                    reservationBasket.Reservations[reservation.MovieId].Add(reservation);
                }
                var basketString = JsonConvert.SerializeObject(reservationBasket);
                await _cache.SetStringAsync(username, basketString);
            }
            return await GetAllReservations(username);
        }

        public async Task DeleteAllReservations(string username)
        {
            await _cache.RemoveAsync(username);
        }

        public async Task DeleteMovieReservations(string username, string movieId)
        {
            ReservationBasket reservationBasket = await GetAllReservations(username);
            if (reservationBasket != null && reservationBasket.Reservations.ContainsKey(movieId))
            {
                reservationBasket.Reservations.Remove(movieId);
                var basketString = JsonConvert.SerializeObject(reservationBasket);
                await _cache.SetStringAsync(username, basketString);
            }
        }

        public async Task DeleteMovieReservation(string username, Reservation reservation)
        {
            ReservationBasket reservationBasket = await GetAllReservations(username);
            reservationBasket.Reservations[reservation.MovieId].Remove(reservation);
            if(reservationBasket.Reservations[reservation.MovieId].Count == 0)
            {
                reservationBasket.Reservations.Remove(reservation.MovieId);
            }
            var basketString = JsonConvert.SerializeObject(reservationBasket);
            await _cache.SetStringAsync(username, basketString);
        }
    }
}