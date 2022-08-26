using Administration.Domain.Common;
using Administration.Domain.Entities;
using Administration.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Domain.Aggregates
{
    public class Reservation : AggregateRoot
    {
        public string BuyerUsername { get; private set; }
        public DateTime ReservationDate { get; private set; }
        public PhoneNumber PhoneNumber { get;private set; }
        public string Email { get; private set; }

        private readonly List<TicketReservation> _ticketReservations = new();
        public IReadOnlyCollection<TicketReservation> TicketReservations => _ticketReservations;

        public Reservation(string buyerUsername, PhoneNumber phoneNumber, string email)
        {
            BuyerUsername = buyerUsername;
            PhoneNumber = phoneNumber;
            Email = email;
        }

        // za porudzbine koje vec postoje u bazi
        public Reservation(int id, string buyerUsername, PhoneNumber phoneNumer, string email)
            :this(buyerUsername, phoneNumer, email)
        {
            Id = id;
        }

        public Reservation(int id)
        {
            Id = id;
        }

        public void AddTicketReservation(string projectionId, string projectionDate, string projectionTerm,  string movieName, string movieId, string theaterHallId, string theaterHallName, int price, int numberOfTickets)
        {
            
            var ticketReservation = new TicketReservation(projectionId, projectionDate, projectionTerm, movieName, movieId, price, theaterHallId, theaterHallName, numberOfTickets);
            _ticketReservations.Add(ticketReservation);
            
        }

        public int GetTotal()
        {
            return TicketReservations.Sum(r => r.Price);
        }
    }
}
