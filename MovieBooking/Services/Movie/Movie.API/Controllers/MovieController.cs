using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Movies.API.DTOs;
using Movies.API.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieRepository _repository;

        public MovieController(IMovieRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("{id}", Name = "GetMovie")]
        [ProducesResponseType(typeof(MovieDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(MovieDTO), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MovieDTO>> GetMovieById(string id)
        {
            var movie = await _repository.GetMovieById(id);
            if (movie == null)
            {
                return NotFound();
            }
            return Ok(movie);
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetAllMovies()
        {
            var movies = await _repository.GetAllMovies();
            return Ok(movies);
        }

        [HttpPost("[action]/{numberOfMovies}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetRandomAiringMovies(int numberOfMovies, [FromBody] string[] feasibleMovies)
        {
            var movies = await _repository.GetRandomMovies(false, numberOfMovies, feasibleMovies);
            return Ok(movies);
        }

        [HttpGet("[action]/{numberOfMovies}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetRandomUpcomingMovies(int numberOfMovies)
        {
            var movies = await _repository.GetRandomMovies(true, numberOfMovies);
            return Ok(movies);
        }

        [HttpGet("[action]/{name}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByTitle(string name)
        {
            var movies = await _repository.GetMoviesByTitle(name);
            return Ok(movies);
        }

        [HttpGet("[action]/{year}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByYear(int year)
        {
            var movies = await _repository.GetMoviesByYear(year);
            return Ok(movies);
        }

        [HttpGet("[action]/{lowerBound}/{upperBound}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByRuntime(int lowerBound, int upperBound)
        {
            var movies = await _repository.GetMoviesByRuntime(lowerBound, upperBound);
            return Ok(movies);
        }

        [HttpGet("[action]/{genre}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByGenre(string genre)
        {
            var movies = await _repository.GetMoviesByGenre(genre);
            return Ok(movies);
        }

        // example string: Action&Comedy&Drama/True
        [HttpGet("[action]/{genres}/{containAllGenres}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByGenres(string genres, bool containAllGenres)
        {
            var allGenres = genres.Split("&").ToArray();

            var movies = await _repository.GetMoviesByGenres(allGenres, containAllGenres);

            return Ok(movies);
        }

        [HttpGet("[action]/{director}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByDirector(string director)
        {
            var movies = await _repository.GetMoviesByDirector(director);
            return Ok(movies);
        }

        [HttpGet("[action]/{mainActor}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByMainActor(string mainActor)
        {
            var movies = await _repository.GetMoviesByMainActor(mainActor);
            return Ok(movies);
        }

        [HttpGet("[action]/{language}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByLanguage(string language)
        {
            var movies = await _repository.GetMoviesByLanguage(language);
            return Ok(movies);
        }

        [HttpGet("[action]/{lowerBound}/{upperBound}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByImdbRating(double lowerBound, double upperBound)
        {
            var movies = await _repository.GetMoviesByImdbRating(lowerBound, upperBound);
            return Ok(movies);
        }

        [HttpGet("[action]/{votes}")]
        [ProducesResponseType(typeof(IEnumerable<MovieDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMoviesByImdbVotes(int votes)
        {
            var movies = await _repository.GetMoviesByImdbVotes(votes);
            return Ok(movies);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(MovieDTO), StatusCodes.Status201Created)]
        public async Task<ActionResult<MovieDTO>> CreateMovie([FromBody] CreateMovieDTO movie)
        {
            await _repository.CreateMovie(movie);

            return CreatedAtRoute("GetMovie", new { id = movie.Id }, movie);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("[action]/{id}")]
        [ProducesResponseType(typeof(MovieDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MovieDTO>> CreateMovieById(string id)
        {
            var result = await _repository.CreateMovieById(id);

            if(result == false)
                return BadRequest();

            var movie = await _repository.GetMovieById(id);

            return movie;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("[action]")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateInformationForAllMovies()
        {
            await _repository.UpdateInformationForAllMovies();
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            await _repository.DeleteMovie(id);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete()]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovies()
        {
            await _repository.DeleteMovies();
            return Ok();
        }

    }
}
