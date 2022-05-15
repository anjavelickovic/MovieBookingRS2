using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservations.API.Entities;

namespace Reservations.API.Repositories
{
    public interface IReservationsRepository
    {
        Task<ReservationBasket> GetReservations(string username);
        Task<Dictionary<string, Reservation>> GetMovieReservations(string username, string movieId);
        Task<ReservationBasket> AddReservation(string username, Reservation reservation);
        Task<ReservationBasket> UpdateReservations(string username, Reservation reservation);
        Task DeleteReservations(string username);
        Task DeleteMovieReservations(string username, string movieId);
        Task DeleteReservation(string username, Reservation reservation);
    }
}
