using Administration.Application.Contracts.Factories;
using Administration.Application.Features.Queries.ViewModels;
using Administration.Domain.Aggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Factories
{
    public class ReservationViewModelFactory : IReservationViewModelFactory
    {
        public ReservationViewModel CreateViewModel(Reservation reservation)
        {
            var reservationVM = new ReservationViewModel();
            reservationVM.Id = reservation.Id;
            reservationVM.BuyerUsername = reservation.BuyerUsername;

            int total = 0;

            var tickets = new List<TicketViewModel>();
            foreach (var ticket in reservationVM.Tickets)
            {
                var ticketVM = new TicketViewModel();
                ticketVM.Id = ticket.Id;
                ticketVM.ProjectionId = ticket.ProjectionId;
                ticketVM.MovieTitle = ticket.MovieTitle;
                ticketVM.MovieId = ticket.MovieId;
                ticketVM.Price = ticket.Price;
                ticketVM.TheaterHallId = ticket.TheaterHallId;
                ticketVM.TheaterHallName = ticket.TheaterHallName;
                ticketVM.NumberOfTickets = ticket.NumberOfTickets;

                total += ticket.Price * ticket.NumberOfTickets;

                tickets.Add(ticketVM);
            }

            reservationVM.TotalPrice = total;

            reservationVM.Tickets = tickets;
            return reservationVM;
        }
    }
}
