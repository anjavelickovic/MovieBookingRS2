using AutoMapper;
using MongoDB.Driver;
using Movies.API.Context;
using Movies.API.DTOs;
using Movies.API.Entities;
using Movies.API.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Repositories
{
    public class MovieRepository : IMovieRepository
    {
        private readonly IMovieContext _movieContext;
        private readonly IMapper _mapper;

        public MovieRepository(IMovieContext movieContext, IMapper mapper)
        {
            _movieContext = movieContext ?? throw new ArgumentNullException(nameof(movieContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<MovieDTO> GetMovieById(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<MovieDTO>> GetRandomMovies(int numberOfMovies = 10)
        {
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();
            if (movies.Count <= numberOfMovies)
            {
                return _mapper.Map<IEnumerable<MovieDTO>>(movies);
            }

            var indexes = new Random().Sample(movies.Count, numberOfMovies).ToList();
            var sampledMovies = new List<MovieDTO>();
            indexes.ForEach(index => sampledMovies.Add(_mapper.Map<MovieDTO>(movies[index])));

            return sampledMovies;
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByTitle(string name)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByYear(int year)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByRuntime(int lowerBound = 60, int upperBound = 240)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByGenre(string genre)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByGenres(string[] genres, bool containAllGenres = true)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByDirector(string director)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByMainActor(string mainActor)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByLanguage(string language)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByImdbRating(float lowerBound = 6.0f, float upperBound = 10.0f)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<MovieDTO>> GetMoviesByImdbVotes(int votes = 100_000)
        {
            throw new NotImplementedException();
        }
        public async Task<bool> CreateMovie(CreateMovieDTO movie)
        {
            throw new NotImplementedException();
        }
        public async Task<bool> CreateMovieById(string id)
        {
            throw new NotImplementedException();
        }
        public async Task<bool> DeleteMovie(string id)
        {
            throw new NotImplementedException();
        }

    }
}
