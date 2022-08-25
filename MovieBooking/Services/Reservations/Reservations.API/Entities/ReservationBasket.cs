using System;
using System.Collections.Generic;

namespace Reservations.API.Entities
{

    public class ReservationBasket
    {
        public string Username { get; set; }
        public Dictionary<string, Dictionary<string, Reservation>> Reservations { get; set; } = new Dictionary<string, Dictionary<string, Reservation>>();
        public int TotalPrice{ get {
                                        int totalPrice = 0;
                                        foreach (var reservations in Reservations){
                                            foreach (var reservation in reservations.Value){
                                                totalPrice += reservation.Value.Price * reservation.Value.NumberOfTickets;
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