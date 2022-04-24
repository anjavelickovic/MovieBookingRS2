using System;

namespace Reservations.API.Entities
{
    public class Reservation
    { 
        public int MovieId { get; set; } 
        public string MovieName { get; set; }
        public int TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public DateTime DateAndTimeOfTheMovie { get; set; }
        public decimal Price { get; set; }
        public int NumberOfTickets { get; set; }
    }
}