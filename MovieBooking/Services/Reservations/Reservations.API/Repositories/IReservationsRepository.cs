using System;
using System.Threading.Tasks;
using Reservations.API.Entities;

namespace Reservations.API.Repositories
{
    public interface IReservationsRepository
    {
        Task<ReservationBasket> GetReservations(string username);
        Task<ReservationBasket> UpdateReservations(ReservationBasket basket);
        Task DeleteReservations(string username);
    }
}
