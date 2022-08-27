using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projections.Common.Entities;
using Projections.Common.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace Projections.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProjectionController : ControllerBase
    {
        private readonly IProjectionRepository _repository;

        public ProjectionController(IProjectionRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet()]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Projection>>> GetProjections()
        {
            return Ok(await _repository.GetProjections());
        }

        [HttpGet("[action]/{date}")]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Projection>>> GetProjectionsByDate(string date)
        {
            return Ok(await _repository.GetProjectionsByDate(date));
        }

        [HttpGet("[action]/{movieId}")]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Projection>>> GetMovieProjections(string movieId)
        {
            return Ok(await _repository.GetMovieProjections(movieId));
        }

        [HttpGet("{id}", Name = "GetProjection")]
        [ProducesResponseType(typeof(Projection), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(Projection), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Projection>> GetProjection(string id)
        {
            var projection = await _repository.GetProjection(id);
            if (projection == null)
            {
                return NotFound(null);
            }
            return Ok(projection);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost()]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status201Created)]
        public async Task<ActionResult<Projection>> CreateProjection([FromBody] Projection projection)
        {
            await _repository.CreateProjection(projection);

            return CreatedAtRoute("GetProjection", new { id = projection.Id }, projection);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut()]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateProjection([FromBody] Projection projection)
        {
            return Ok(await _repository.UpdateProjection(projection));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjection(string id)
        {
            return Ok(await _repository.DeleteProjection(id));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("[action]/{movieTitle}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjectionsByMovieTitle(string movieTitle)
        { 
            return Ok(await _repository.DeleteProjectionsByMovieTitle(movieTitle));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("[action]/{date}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjectionsByDate(string date)
        {
            return Ok(await _repository.DeleteProjectionsByDate(date));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete()]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjections()
        {
            return Ok(await _repository.DeleteProjections());
        }
    }
}