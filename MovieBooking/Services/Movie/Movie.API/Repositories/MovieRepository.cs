﻿using AutoMapper;
using MongoDB.Driver;
using Movies.API.Context;
using Movies.API.DTOs;
using Movies.API.Entities;
using Movies.API.Extensions;
using Movies.API.Helpers;
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
        private readonly double PRECISION = 0.0001;

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

        public async Task<IEnumerable<MovieDTO>> GetAllMovies() {
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetRandomMovies(bool upcomingMovies, int numberOfMovies, string[] feasibleMovies)
        {
            List<Movie> movies;

            if (upcomingMovies){
                movies = await _movieContext.Movies.Find(movie => !movie.ImdbVotes.HasValue).ToListAsync();
            }
            else {
                movies = await _movieContext.Movies.Find(movie => movie.ImdbVotes.HasValue).ToListAsync();
            }

            if (feasibleMovies != null) {
                movies = movies.Where(movie => feasibleMovies.Contains(movie.Id)).ToList();
            }

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
                                    movie.Title.ToLower().Contains(name)).ToListAsync();
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
                .Select(movie => new { RuntimeInt = 
                        Int32.Parse( movie.Runtime?.Substring(0, movie.Runtime.Length - 4) ?? "-1"), Item = movie })
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
                return _mapper.Map<IEnumerable<MovieDTO>>(movies.FindAll(movie =>
                       movie.Genres.Select(x => x.ToLower()).Intersect(genres.Select(x => x.ToLower())).Count() == genres.Count()));
            }

            var moviesSet = new HashSet<Movie>();

            foreach (var genre in genres) {
                moviesSet.UnionWith( movies.FindAll(movie => movie.Genres.Contains(genre)) );
            }

            return _mapper.Map<IEnumerable<MovieDTO>>(moviesSet);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByDirector(string director)
        {
            var movieDirector = director.ToLower();
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();

            return _mapper.Map<IEnumerable<MovieDTO>>(movies.FindAll(movie => {
                foreach (var director in movie.Directors)
                    if (director.ToLower().Contains(movieDirector))
                        return true;
                return false;
            }
            ));
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByMainActor(string mainActor)
        {
            mainActor = mainActor.ToLower();
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();

            return _mapper.Map<IEnumerable<MovieDTO>>(movies.FindAll(movie => {
                foreach (var actor in movie.MainActors)
                    if (actor.ToLower().Contains(mainActor))
                        return true;
                return false;
            }
            ));
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByLanguage(string language)
        {
            language = language.ToLower();
            var movies = await _movieContext.Movies.Find(movie => true).ToListAsync();

            return _mapper.Map<IEnumerable<MovieDTO>>(movies.FindAll(movie => {
                foreach (var movieLanguage in movie.Languages)
                    if (movieLanguage.ToLower().Contains(language))
                        return true;
                return false;
            }
            ));
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByImdbRating(double lowerBound = 6.0f, double upperBound = 10.0f)
        {
            var movies = await _movieContext.Movies.Find(movie => 
                   ( (lowerBound - PRECISION < movie.ImdbRating) &&
                    (movie.ImdbRating < lowerBound + PRECISION) ) ||
                   ( (upperBound - PRECISION < movie.ImdbRating) &&
                    (movie.ImdbRating < upperBound + PRECISION)) ||
                    (movie.ImdbRating > lowerBound + PRECISION && movie.ImdbRating < upperBound - PRECISION))
                .ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<IEnumerable<MovieDTO>> GetMoviesByImdbVotes(int votes = 100_000)
        {
            var movies = await _movieContext.Movies.Find(movie => (movie.ImdbVotes > votes)).ToListAsync();
            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<MovieErrorCode> CreateMovieById(string id)
        {
            var movie = await _movieContext.Movies.Find(movie => (movie.Id == id)).FirstOrDefaultAsync();
            if (movie != null)
                return MovieErrorCode.ALREADY_IN_DATABASE;

            var result = await ImdbClient.FetchJsonDataForMovie(id);

            if (result == null)
                return MovieErrorCode.MOVIE_CREATION_ERROR;

            if (await _movieContext.LastUpdatedDate.CountDocumentsAsync(date => true) == 0) {
                await _movieContext.LastUpdatedDate.InsertOneAsync(new LastUpdate(DateTime.Now));
            }
            await _movieContext.Movies.InsertOneAsync(result.ToObject<Movie>());

            return MovieErrorCode.SUCCESS;
        }

        public async Task UpdateInformationForAllMovies() 
        {
            var movies = await _movieContext.Movies.Find(p => true).ToListAsync();
            foreach (var movie in movies) 
            {
                var updatedMovie = (await ImdbClient.FetchJsonDataForMovie(movie.Id)).ToObject<Movie>();
                var filter = Builders<Movie>.Filter.Eq(movie => movie.Id, updatedMovie.Id);

                await _movieContext.Movies.ReplaceOneAsync(filter, updatedMovie);
            }
        }

        public async Task<bool> DeleteMovie(string id)
        {
            var deleteResult = await _movieContext.Movies.DeleteOneAsync(movie => (movie.Id == id));
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }

        public async Task<bool> DeleteMovies()
        {
            var deleted = true;
            var movies = await GetAllMovies();
            foreach (var movie in movies)
            {
                var deleteResult = await _movieContext.Movies.DeleteOneAsync(p => p.Id == movie.Id);
                deleted = deleted && deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
            }
            return deleted;
        }

        public async Task<LastUpdate> GetLastUpdatedDate()
        {
            var movie = await _movieContext.LastUpdatedDate.Find(movie => true).FirstOrDefaultAsync();
            return movie;
        }

        public async Task UpdateLastUpdatedDate()
        {
            await _movieContext.LastUpdatedDate.DeleteOneAsync(p => true);
            await _movieContext.LastUpdatedDate.InsertOneAsync(new LastUpdate(DateTime.Now));
        }
    }
}
