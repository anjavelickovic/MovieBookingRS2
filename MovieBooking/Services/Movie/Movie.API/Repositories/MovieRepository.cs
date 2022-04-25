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
        private readonly decimal PRECISION = 0.00000001M;

        public MovieRepository(IMovieContext movieContext, IMapper mapper)
        {
            _movieContext = movieContext ?? throw new ArgumentNullException(nameof(movieContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<MovieDTO> GetMovieById(string id)
        {
            var movie = await _movieContext.Movies.Find(movie => (movie.Id == id)).FirstOrDefaultAsync();
            return _mapper.Map<MovieDTO>(movie);
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
            var movies = await _movieContext.Movies.Find(movie => 
                                    movie.Title.ToLower().Contains(name.ToLower())).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByYear(int year)
        {
            var movies = await _movieContext.Movies.Find(movie => (movie.Year == year)).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByRuntime(int lowerBound = 60, int upperBound = 240)
        {
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();

            return _mapper.Map<IEnumerable<MovieDTO>>(movies
                .Select(movie => new { RuntimeInt = Int32.Parse(movie.Runtime.Substring(0, movie.Runtime.Length - 4)), Item = movie })
                .Where(obj => lowerBound <= obj.RuntimeInt && obj.RuntimeInt <= upperBound)
                .Select(obj => obj.Item));

        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByGenre(string genre)
        {
            return await GetMoviesByGenres(new string[] { genre });
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByGenres(string[] genres, bool containAllGenres = true)
        {
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();

            if (containAllGenres) {
                var genresLowerCase = new List<string>(genres);
                genresLowerCase = genresLowerCase.ConvertAll(genre => genre.ToLower());
                return _mapper.Map<IEnumerable<MovieDTO>> (movies.FindAll(movie =>
                                        movie.Genres.Intersect(genresLowerCase).Count() == genresLowerCase.Count()));
            }

            var moviesSet = new HashSet<Movie>();

            foreach (var genre in genres) {
                moviesSet.UnionWith( movies.FindAll(movie => movie.Genres.Contains(genre.ToLower())) );
            }

            return _mapper.Map<IEnumerable<MovieDTO>>(moviesSet);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByDirector(string director)
        {
            var movies = await _movieContext.Movies.Find(movie => movie.Director.Contains(director.ToLower())).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByMainActor(string mainActor)
        {
            var movies = await _movieContext.Movies.Find(movie => movie.MainActors.Contains(mainActor.ToLower())).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByLanguage(string language)
        {
            var movies = await _movieContext.Movies.Find(movie => movie.Languages.Contains(language.ToLower())).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByImdbRating(decimal lowerBound = 6.0M, decimal upperBound = 10.0M)
        {
            var movies = await _movieContext.Movies.Find(movie => 
                    Math.Abs(lowerBound - movie.ImdbRating) < PRECISION ||
                    Math.Abs(upperBound - movie.ImdbRating) < PRECISION ||
                    (movie.ImdbRating - lowerBound > PRECISION && movie.ImdbRating - upperBound < -PRECISION))
                .ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByImdbVotes(int votes = 100_000)
        {
            var movies = await _movieContext.Movies.Find(movie => (movie.ImdbVotes > votes)).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
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
