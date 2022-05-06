﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reservations.API.Entities;
using Reservations.API.Repositories;

namespace Reservations.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsRepository _repository;

        public ReservationsController(IReservationsRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("{username}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> GetAllReservations(string username)
        {
            var basket = await _repository.GetAllReservations(username);
            return Ok(basket ?? new ReservationBasket(username));
        }

        [HttpGet("{username}/movieId/{movieId}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> GetMovieReservations(string username, string movieId)
        {
            var reservation = await _repository.GetMovieReservations(username, movieId);
            return Ok(reservation ?? new List<Reservation>());
        }


        [HttpPut("username")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> UpdateReservations(string username, [FromBody] Reservation reservation)
        {
            return Ok(await _repository.UpdateReservations(username, reservation));
        }

        [HttpDelete("{username}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAllReservations(string username)
        {
            await _repository.DeleteAllReservations(username);
            return Ok();
        }

        [HttpDelete("{username}/movieId/{movieId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovieReservations(string username, string movieId)
        {
            await _repository.DeleteMovieReservations(username, movieId);
            return Ok();
        }

        [HttpDelete("deleteOne/{username}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovieReservation(string username, [FromBody] Reservation reservation)
        {
            await _repository.DeleteMovieReservation(username, reservation);
            return Ok();
        }

    }
}