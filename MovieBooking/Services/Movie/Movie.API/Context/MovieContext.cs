using AutoMapper;
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
        public MovieContext(IConfiguration configuration, IMapper mapper)
        {
            var client = new MongoClient(configuration.GetValue<string>("DatabaseSettings:ConnectionString"));
            var database = client.GetDatabase("MoviesDB");
            Movies = mapper.Map<IMongoCollection<MovieDTO>>(database.GetCollection<Movie>("Movies"));
        }

        public IMongoCollection<MovieDTO> Movies { get; }
    }
}
