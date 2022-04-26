using Movies.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Repositories
{
    public interface IMovieRepository
    {
        Task<MovieDTO> GetMovieById(string id);
        Task<IEnumerable<MovieDTO>> GetRandomMovies(int numberOfMovies);
        Task<IEnumerable<MovieDTO>> GetMoviesByTitle(string name);
        Task<IEnumerable<MovieDTO>> GetMoviesByYear(int year);
        Task<IEnumerable<MovieDTO>> GetMoviesByRuntime(int lowerBound, int upperBound);
        Task<IEnumerable<MovieDTO>> GetMoviesByGenre(string genre);
        Task<IEnumerable<MovieDTO>> GetMoviesByGenres(string[] genres, bool containAllGenres);
        Task<IEnumerable<MovieDTO>> GetMoviesByDirector(string director);
        Task<IEnumerable<MovieDTO>> GetMoviesByMainActor(string mainActor);
        Task<IEnumerable<MovieDTO>> GetMoviesByLanguage(string language);
        Task<IEnumerable<MovieDTO>> GetMoviesByImdbRating(decimal lowerBound, decimal upperBound);
        Task<IEnumerable<MovieDTO>> GetMoviesByImdbVotes(int votes);
        Task<bool> CreateMovie(CreateMovieDTO movie);
        Task<bool> CreateMovieById(string id);
        Task<bool> DeleteMovie(string id);
    }
}
