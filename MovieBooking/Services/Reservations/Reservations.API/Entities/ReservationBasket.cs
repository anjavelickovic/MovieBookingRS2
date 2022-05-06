using System;
using System.Collections.Generic;

namespace Reservations.API.Entities
{

    public class ReservationBasket
    {
        public string Username { get; set; }
        public Dictionary<string, List<Reservation>> Reservations { get; set; } = new Dictionary<string, List<Reservation>>();
        public decimal TotalPrice{ get {
                                        decimal totalPrice = 0;
                                        foreach (var reservations in Reservations){
                                            foreach (var reservation in reservations.Value){
                                                totalPrice += reservation.Price * reservation.NumberOfTickets;
                                            }
                                        }
                                        return totalPrice;
                                   }
        }

        public ReservationBasket() { }
        public ReservationBasket(string username)
        {
            Username = username ?? throw new ArgumentNullException(nameof(username));
        }

        
    }
}