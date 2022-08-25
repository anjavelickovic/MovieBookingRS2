using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheaterHalls.API.Entities;
using TheaterHalls.API.Repositories;

namespace TheaterHalls.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TheaterHallController: ControllerBase
    {
        private readonly ITheaterHallRepository _repository;

        public TheaterHallController(ITheaterHallRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet()]
        [ProducesResponseType(typeof(IEnumerable<TheaterHall>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TheaterHall>>> GetTheaterHalls()
        {
            var theaterHalls = await _repository.GetTheaterHalls();
            return Ok(theaterHalls);
        }

        [HttpGet("{id}", Name = "GetTheaterHall")]
        [ProducesResponseType(typeof(TheaterHall), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(TheaterHall), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TheaterHall>> GetTheaterHall(string id)
        {
            var theaterHall = await _repository.GetTheaterHall(id);
            if (theaterHall == null)
            {
                return NotFound(null);
            }
            return Ok(theaterHall);
        }

        [HttpPost()]
        [ProducesResponseType(typeof(IEnumerable<TheaterHall>), StatusCodes.Status201Created)]
        public async Task<ActionResult<TheaterHall>> CreateTheaterHall([FromBody] TheaterHall theaterHall)
        {
            await _repository.CreateTheaterHall(theaterHall);

            return CreatedAtRoute("GetTheaterHall", new { id = theaterHall.Id }, theaterHall);
        }

        [HttpPut()]
        [ProducesResponseType(typeof(TheaterHall), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateTheaterHall([FromBody] TheaterHall theaterHall)
        {
            return Ok(await _repository.UpdateTheaterHall(theaterHall));
        }

        [HttpDelete()]
        [ProducesResponseType(typeof(TheaterHall), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteTheaterHall(string id)
        {
            return Ok(await _repository.DeleteTheaterHall(id));
        }
    }
}
