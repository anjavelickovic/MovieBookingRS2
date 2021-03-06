using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projections.Common.Entities;
using Projections.Common.Repositories;

namespace Projections.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProjectionController : ControllerBase
    {
        private readonly IProjectionRepository _repository;

        public ProjectionController(IProjectionRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("[action]")]
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

        [HttpGet("[action]/{id}", Name = "GetProjection")]
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

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status201Created)]
        public async Task<ActionResult<Projection>> CreateProjection([FromBody] Projection projection)
        {
            await _repository.CreateProjection(projection);

            return CreatedAtRoute("GetProjection", new { id = projection.Id }, projection);
        }

        [HttpPut("[action]")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateProjection([FromBody] Projection projection)
        {
            return Ok(await _repository.UpdateProjection(projection));
        }

        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjection(string id)
        {
            return Ok(await _repository.DeleteProjection(id));
        }

        [HttpDelete("[action]/{movieId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovieProjections(string movieId)
        { 
            return Ok(await _repository.DeleteMovieProjections(movieId));
        }

        [HttpDelete("[action]")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjections()
        {
            return Ok(await _repository.DeleteProjections());
        }
    }
}