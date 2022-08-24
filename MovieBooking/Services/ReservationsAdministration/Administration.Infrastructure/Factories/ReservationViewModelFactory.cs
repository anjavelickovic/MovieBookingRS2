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
            reservationVM.BuyerId = reservation.BuyerId;
            reservationVM.BuyerUsername = reservation.BuyerUsername;

            var tickets = new List<TicketViewModel>();
            foreach (var ticket in tickets)
            {
                var ticketVM = new TicketViewModel();
                ticketVM.Id = ticket.Id;
                ticketVM.ProjectionId = ticket.ProjectionId;
                ticketVM.ProjectionDate = ticket.ProjectionDate;
                ticketVM.ProjectionTerm = ticket.ProjectionTerm;
                ticketVM.MovieTitle = ticket.MovieTitle;
                ticketVM.MovieId = ticket.MovieId;
                ticketVM.Price = ticket.Price;
                ticketVM.TheaterHallId = ticket.TheaterHallId;
                ticketVM.TheaterHallName = ticket.TheaterHallName;
                ticketVM.NumberOfTickets = ticket.NumberOfTickets;

                tickets.Add(ticketVM);
            }

            reservationVM.Tickets = tickets;
            return reservationVM;
        }
    }
}
