namespace Administration.Application.Features.Commands.CreateReservation
{
    public class TicketDTO
    {
        public string MovieTitle { get; private set; }
        public string MovieId { get; private set; }
        public decimal Price { get; private set; }
        public string CinemaHallId { get; set; }
        public string CinemaHallName { get; set; }
        public int NumberOfTickets { get; set; }

    }
}