using System;
using System.Collections.Generic;

namespace Reservations.API.Entities
{

    public class ReservationBasket
    {
        public string Username { get; set; }
        public List<Reservation> Reservations { get; set; } = new List<Reservation>();

        public ReservationBasket() { }
        public ReservationBasket(string username)
        {
            Username = username ?? throw new ArgumentNullException(nameof(username));
        }

        public decimal TotalPrice
        {
            get
            {
                decimal totalPrice = 0;
                foreach (var reservation in Reservations)
                {
                    totalPrice += reservation.Price * reservation.NumberOfTickets;
                }
                return totalPrice;
            }
        }
    }
}