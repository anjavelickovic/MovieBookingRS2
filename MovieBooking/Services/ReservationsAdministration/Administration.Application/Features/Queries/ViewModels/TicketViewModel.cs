namespace Administration.Application.Features.Queries.ViewModels
{
    public class TicketViewModel
    {
        public int Id { get; set; }

        public string MovieTitle { get; set; }
        public string MovieId { get; set; }
        public decimal Price { get; set; }
        public string CinemaHallId { get; set; }
        public string CinemaHallName { get; set; }
        public int NumberOfTickets { get; set; }

    }
}