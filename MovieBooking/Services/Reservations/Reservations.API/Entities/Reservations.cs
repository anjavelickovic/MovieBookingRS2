using System;
using System.Collections.Generic;

namespace Reservations.API.Entities{

    public class Reservations{

        public string Username { get; set; }
        public List<Reservation> ListOfReservations { get; set; } = new List<Reservation>();

        public Reservations(){}
        public Reservations(string username) {
            Username = username ?? throw new ArgumentNullException(nameof(username));
        }

        public decimal TotalPrice {
            get{
                decimal totalPrice = 0;
                foreach (var reservation in ListOfReservations)
                {
                    totalPrice += reservation.Price * reservation.NumberOfTickets;
                }
                return totalPrice;
            }
        }
    }
}
