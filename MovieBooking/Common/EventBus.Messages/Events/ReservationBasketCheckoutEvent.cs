using System;
using System.Collections.Generic;

namespace EventBus.Messages.Events
{
    public class ReservationItem
    {
        public string ProjectionId { get; set; }
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public decimal Price { get; set; }
        public int NumberOfTickets { get; set; }
    }

    public class ReservationBasketCheckoutEvent: IntegrationBaseEvent
    {
        public string BuyerId { get; private set; }
        public string BuyerUsername { get; private set; }
        public string Email { get; set; }
        public IEnumerable<ReservationItem> Tickets { get; set; }

        //phoneNumber
        public string AreaCode { get; private set; }
        public string Number { get; private set; }
    }
}
