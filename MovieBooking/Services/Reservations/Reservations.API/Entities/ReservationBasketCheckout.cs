using System;
using System.Collections.Generic;

namespace Reservations.API.Entities
{
    public class ReservationBasketCheckout
    {
        public string BuyerId { get; private set; }
        public string BuyerUsername { get; private set; }
        public string Email { get; set; }
        public IEnumerable<Reservation> Tickets { get; set; }

        //phoneNumber
        public string AreaCode { get; private set; }
        public string Number { get; private set; }
    }
}
