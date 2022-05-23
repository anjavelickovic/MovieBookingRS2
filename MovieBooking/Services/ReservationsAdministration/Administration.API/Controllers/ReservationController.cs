﻿using Administration.Application.Features.Commands.CreateReservation;
using Administration.Application.Features.Queries.GetListOfReservations;
using Administration.Application.Features.Queries.ViewModels;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Administration.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReservationController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpGet("{username}")]
        [ProducesResponseType(typeof(IEnumerable<ReservationViewModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ReservationViewModel>>> GetReservationByUsername(string username)
        {
            var query = new GetListOfReservationsQuery(username);
            var reservations = await _mediator.Send(query);

            return Ok(reservations);
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> CheckoutReservation(CreateReservationCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
