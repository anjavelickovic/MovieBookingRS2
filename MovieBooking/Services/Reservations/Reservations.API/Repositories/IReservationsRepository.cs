using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Reservations.API.Entities;

namespace Reservations.API.Repositories
{
    public interface IReservationsRepository
    {
        Task<ReservationBasket> GetAllReservations(string username);
        Task<List<Reservation>> GetMovieReservations(string username, string movieId);
        Task<ReservationBasket> UpdateReservations(string username, Reservation reservation);
        Task DeleteAllReservations(string username);
        Task DeleteMovieReservations(string username, string movieId);
        Task DeleteMovieReservation(string username, Reservation reservation);
    }
}
