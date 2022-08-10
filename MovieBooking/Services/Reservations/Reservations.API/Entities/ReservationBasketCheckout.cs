using System;
using System.Collections.Generic;

namespace Reservations.API.Entities
{
    public class ReservationBasketCheckout
    {
        public string BuyerId { get; set; }
        public string BuyerUsername { get; set; }
        public string Email { get; set; }
        public IEnumerable<Reservation> Tickets { get; set; }

        //phoneNumber
        public string AreaCode { get; set; }
        public string Number { get; set; }
    }
}
