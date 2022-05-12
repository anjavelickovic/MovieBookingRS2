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
            var projection = await _repository.GetProjections();
            return Ok(projection);
        }

        [HttpGet("[action]/{movieId}")]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Projection>>> GetMovieProjections(string movieId)
        {
            var projection = await _repository.GetMovieProjections(movieId);
            return Ok(projection);
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

        [HttpPost]
        [ProducesResponseType(typeof(IEnumerable<Projection>), StatusCodes.Status201Created)]
        public async Task<ActionResult<Projection>> CreateProjection([FromBody] Projection projection)
        {
            await _repository.CreateProjection(projection);

            return CreatedAtRoute("GetProjection", new { id = projection.Id }, projection);
        }

        [HttpPut]
        [ProducesResponseType(typeof(Projection), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateProjection([FromBody] Projection projection)
        {
            return Ok(await _repository.UpdateProjection(projection));
        }

        [HttpDelete]
        [ProducesResponseType(typeof(Projection), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProjection(string id)
        {
            return Ok(await _repository.DeleteProjection(id));
        }
    }
}