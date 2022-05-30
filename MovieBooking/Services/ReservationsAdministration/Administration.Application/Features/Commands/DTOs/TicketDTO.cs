namespace Administration.Application.Features.Commands.CreateReservation
{
    public class TicketDTO
    {
        public string ProjectionId { get; set; }
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public decimal Price { get; set; }
        public int NumberOfTickets { get; set; }
    }
}