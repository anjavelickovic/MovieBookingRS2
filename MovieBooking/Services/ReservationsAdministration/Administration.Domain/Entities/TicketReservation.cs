using Administration.Domain.Exceptions;
using Ordering.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Domain.Entities
{
    public class TicketReservation : EntityBase
    {
        public string ProjectionId { get; set; }
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public decimal Price { get; set; }
        public int NumberOfTickets { get; set; } = 0;


        public TicketReservation(string projectionId, string movieTitle, string movieId, decimal price, string theaterHallId, string theaterHallName, int numberOfTickets)
        {
            ProjectionId = projectionId ?? throw new ArgumentNullException(nameof(projectionId));
            MovieTitle = movieTitle ?? throw new ArgumentNullException(nameof(movieTitle));
            MovieId = movieId ?? throw new ArgumentNullException(nameof(movieId));
            TheaterHallId = theaterHallId ?? throw new ArgumentNullException(nameof(theaterHallId));
            TheaterHallName = theaterHallName ?? throw new ArgumentNullException(nameof(theaterHallName));
            Price = price;
            AddTickets(numberOfTickets);
        }

        public void AddTickets(int numberOfTickets)
        {
            var newNumber = numberOfTickets + NumberOfTickets;

            if(newNumber <= 0) {
                throw new AdministrationDomainException("Invalid number of tickets");   
            }

            NumberOfTickets = newNumber;
        }
    }
}
