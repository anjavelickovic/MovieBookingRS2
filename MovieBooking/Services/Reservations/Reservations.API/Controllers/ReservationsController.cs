using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reservations.API.Entities;
using Reservations.API.Repositories;

namespace Reservations.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReservationsController: ControllerBase
    {
        private readonly IReservationsRepository _repository;

        public ReservationsController(IReservationsRepository repository) {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("{username}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> GetReservations(string username)
        {
            var basket = await _repository.GetReservations(username);
            return Ok(basket ?? new ReservationBasket(username));
        }


        [HttpPut]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> UpdateReservations([FromBody] ReservationBasket basket)
        {
            return Ok(await _repository.UpdateReservations(basket));
        }

        [HttpDelete("{username}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteReservations(string username)
        {
            await _repository.DeleteReservations(username);
            return Ok();
        }

    }
}
