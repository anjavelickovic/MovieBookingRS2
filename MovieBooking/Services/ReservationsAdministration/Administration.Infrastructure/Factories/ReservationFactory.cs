using Administration.Application.Contracts.Factories;
using Administration.Application.Features.Commands.CreateReservation;
using Administration.Domain.Aggregates;
using Administration.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Factories
{
    public class ReservationFactory : IReservationFactory
    {
        public Reservation Create(CreateReservationCommand command)
        {
            var reservation = new Reservation(command.BuyerId, command.BuyerUsername, new PhoneNumber(command.AreaCode, command.Number), command.Email);

            foreach(var ticket in command.Tickets)
            {
                reservation.AddTicketReservation(ticket.ProjectionId,tickets.projectionDate, ticket.projectionTerm, ticket.MovieTitle, ticket.MovieId, ticket.TheaterHallId, ticket.TheaterHallName, ticket.Price, ticket.NumberOfTickets);
            }

            return reservation;
        }
    }
}
