using Movies.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Repositories
{
    interface IMovieRepository
    {
        Task<MovieDTO> GetMovieById(string id);
        Task<IEnumerable<MovieDTO>> GetRandomMovies(int numberOfMovies = 10);
        Task<IEnumerable<MovieDTO>> GetMoviesByName(string name);
        Task<IEnumerable<MovieDTO>> GetMoviesByYear(int year);
        Task<IEnumerable<MovieDTO>> GetMoviesByRuntime(int lowerBound = 60, int upperBound = 240);
        Task<IEnumerable<MovieDTO>> GetMoviesByGenre(string genre);
        Task<IEnumerable<MovieDTO>> GetMoviesByGenres(string[] genres, bool containAllGenres = true);
        Task<IEnumerable<MovieDTO>> GetMoviesByDirector(string director);
        Task<IEnumerable<MovieDTO>> GetMoviesByMainActor(string mainActor);
        Task<IEnumerable<MovieDTO>> GetMoviesByLanguage(string language);
        Task<IEnumerable<MovieDTO>> GetMoviesByImdbRating(float lowerBound = 6.0f, float upperBound = 10.0f);
        Task<IEnumerable<MovieDTO>> GetMoviesByImdbVotes(int votes = 100_000);
        Task<bool> CreateMovie(CreateMovieDTO movie);
        Task<bool> CreateMovieById(string id);
        Task<bool> DeleteMovie(string id);
    }
}
