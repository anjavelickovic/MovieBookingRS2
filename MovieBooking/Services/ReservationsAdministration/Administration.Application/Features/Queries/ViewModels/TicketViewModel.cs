﻿namespace Administration.Application.Features.Queries.ViewModels
{
    public class TicketViewModel
    {
        public int Id { get; set; }

        public string ProjectionId { get; set; }
        public string ProjectionDate { get; set; }
        public string ProjectionTerm { get; set; }
        public string MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string TheaterHallId { get; set; }
        public string TheaterHallName { get; set; }
        public int Price { get; set; }
        public int NumberOfTickets { get; set; }

    }
}