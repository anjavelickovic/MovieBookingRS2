using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.DTOs
{
    public class BaseMovieDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public int Year { get; set; }
        public string Released { get; set; }
        public string Runtime { get; set; }
        public string[] Genres { get; set; }
        public string Director { get; set; }
        public string[] MainActors { get; set; }
        public string Plot { get; set; }
        public string[] Languages { get; set; }
        public string Poster { get; set; }
        public double ImdbRating { get; set; }
        public int ImdbVotes { get; set; }
        public string Trailer { get; set; }
    }
}
