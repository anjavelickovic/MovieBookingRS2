using Movies.API.DTOs;
using Movies.API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Repositories
{
    public interface IMovieRepository
    {
        Task<MovieDTO> GetMovieById(string id);
        Task<IEnumerable<MovieDTO>> GetAllMovies();
        Task<IEnumerable<MovieDTO>> GetRandomMovies(bool upcomingMovies, int numberOfMovies, string[] feasibleMovies = null);
        Task<IEnumerable<MovieDTO>> GetMoviesByTitle(string name);
        Task<IEnumerable<MovieDTO>> GetMoviesByYear(int year);
        Task<IEnumerable<MovieDTO>> GetMoviesByRuntime(int lowerBound, int upperBound);
        Task<IEnumerable<MovieDTO>> GetMoviesByGenre(string genre);
        Task<IEnumerable<MovieDTO>> GetMoviesByGenres(string[] genres, bool containAllGenres);
        Task<IEnumerable<MovieDTO>> GetMoviesByDirector(string director);
        Task<IEnumerable<MovieDTO>> GetMoviesByMainActor(string mainActor);
        Task<IEnumerable<MovieDTO>> GetMoviesByLanguage(string language);
        Task<IEnumerable<MovieDTO>> GetMoviesByImdbRating(double lowerBound, double upperBound);
        Task<IEnumerable<MovieDTO>> GetMoviesByImdbVotes(int votes);
        Task<MovieErrorCode> CreateMovieById(string id);
        Task UpdateInformationForAllMovies();
        Task<bool> DeleteMovie(string id);
        Task<bool> DeleteMovies();
        Task<LastUpdate> GetLastUpdatedDate();
    }

}
