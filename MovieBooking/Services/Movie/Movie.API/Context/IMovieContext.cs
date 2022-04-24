using MongoDB.Driver;
using Movies.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Context
{
    public interface IMovieContext
    {
        IMongoCollection<MovieDTO> Movies { get; }
    }
}
