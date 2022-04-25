using System;

namespace Reservations.API.Entities
{
    public class Reservation
    {
        public string Id { get; set; }
        public string MovieId { get; set; } 
        public string MovieTitle { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public DateTime ReservatioinDate{ get; set; }
        public decimal Price { get; set; }
        public int NumberOfTickets { get; set; }
    }
}