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
        public string BuyerId { get; private set; }
        public string BuyerUsername { get; private set; }
        public DateTime ReservationDate { get; private set; }
        public PhoneNumber PhoneNumer { get;private set; }
        
        private readonly List<TicketReservation> _ticketReservations = new();
        public IReadOnlyCollection<TicketReservation> TicketReservations => _ticketReservations;

        public Reservation(string buyerId, string buyerUsername, PhoneNumber phoneNumer)
        {
            BuyerId = buyerId ?? throw new ArgumentNullException(nameof(buyerId));
            BuyerUsername = buyerUsername ?? throw new ArgumentNullException(nameof(buyerUsername));
            PhoneNumer = phoneNumer ?? throw new ArgumentNullException(nameof(phoneNumer));
            ReservationDate = DateTime.Now;
        }

        // za porudzbine koje vec postoje u bazi
        public Reservation(int id, string buyerId, string buyerUsername, PhoneNumber phoneNumer)
            : this(buyerId, buyerUsername, phoneNumer)
        {
            Id = id;
        }

        public Reservation(int id)
        {
            Id = id;
        }

        public void AddTicketReservation(string movieName, string movieId, string theaterHallId, string theaterHallName, decimal price, int numberOfTickets = 1)
        {
            var existingReservation = TicketReservations.Where(r => r.MovieId == movieId).SingleOrDefault();

            if(existingReservation == null)
            {
                var ticketReservation = new TicketReservation(movieName, movieId, price, theaterHallId, theaterHallName, numberOfTickets);
                _ticketReservations.Add(ticketReservation);
            }
            else
            {
                existingReservation.AddTickets(numberOfTickets);
            }
        }

        public decimal GetTotal()
        {
            return TicketReservations.Sum(r => r.Price);
        }
    }
}
