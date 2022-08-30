using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Movies.API.DTOs;
using Movies.API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Context
{
    public class MovieContext : IMovieContext
    {
        public MovieContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetValue<string>("DatabaseSettings:ConnectionString"));
            var movieDatabase = client.GetDatabase("MoviesDB");
            Movies = movieDatabase.GetCollection<Movie>("Movies");
            LastUpdatedDate = movieDatabase.GetCollection<LastUpdate>("LastUpdatedDate");
        }

        public IMongoCollection<Movie> Movies { get; }
        public IMongoCollection<LastUpdate> LastUpdatedDate { get; }
    }
}
