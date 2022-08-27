using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Grpc.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Reservations.API.Entities;
using Reservations.API.GrpcServices;
using Reservations.API.Repositories;
using EventBus.Messages.Events;
using MassTransit;
using Microsoft.AspNetCore.Authorization;

namespace Reservations.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsRepository _repository;
        private readonly CouponGrpcService _couponGrpcService;
        private readonly ProjectionGrpcService _projectionGrpcService;
        private readonly ILogger<ReservationsController> _logger;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;

        public ReservationsController(IReservationsRepository repository, CouponGrpcService couponGrpcService, ProjectionGrpcService projectionGrpcService, ILogger<ReservationsController> logger, IMapper mapper, IPublishEndpoint publishEndpoint)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _couponGrpcService = couponGrpcService ?? throw new ArgumentNullException(nameof(couponGrpcService));
            _projectionGrpcService = projectionGrpcService ?? throw new ArgumentNullException(nameof(projectionGrpcService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
        }

        [HttpGet("[action]/{username}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> GetReservations(string username)
        {
            var basket = await _repository.GetReservations(username);
            return Ok(basket ?? new ReservationBasket(username));
        }

        [HttpGet("[action]/username/{username}/movieId/{movieId}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<ReservationBasket>> GetMovieReservations(string username, string movieId)
        {
            var reservation = await _repository.GetMovieReservations(username, movieId);
            return Ok(reservation ?? new Dictionary<string, Reservation>());
        }


        [HttpPost("[action]/{username}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ReservationBasket>> AddReservation(string username, [FromBody] Reservation reservation)
        {
            var changeProjection = true;
            var basket = await _repository.GetReservations(username);
            basket = basket ?? new ReservationBasket(username);

            foreach (var reservationsEntry in basket.Reservations)
            {
                foreach (var entry in reservationsEntry.Value)
                {
                    if (entry.Key.Equals(reservation.ProjectionId))
                    {
                        changeProjection = false;
                    }
                }
            }

            if (!changeProjection)
            {
                return BadRequest("You can not reserve more seats for same projection. Go into reservations and updated it.") ;
            }

                try
            {
                var coupon = await _couponGrpcService.GetDiscount(reservation.MovieTitle);
                reservation.Price -= reservation.Price * coupon.Amount/100;

            }
            catch (RpcException e)
            {
                _logger.LogInformation("Error while retrieving coupon for movie {MovieTtitle}: {msg}", reservation.MovieTitle, e.Message);
            }
            try
            {
                    var projection = await _projectionGrpcService.GetProjection(reservation.ProjectionId);
                    var sucessfullyUpdatedNumberOfReservedSeats = await _projectionGrpcService.UpdateProjection(projection.Id, reservation.NumberOfTickets);
                    if (!sucessfullyUpdatedNumberOfReservedSeats.Updated)
                    {
                        _logger.LogInformation("There is no enough seats for this projection");
                        return NotFound("There is no enough seats for this projection");
                    }
                
            }
            catch(RpcException e)
            {
                _logger.LogInformation("Error while retrieving projection for movie {MovieTtitle}: {msg}", reservation.MovieTitle, e.Message);
            }

            return Ok(await _repository.AddReservation(username, reservation));
        }

        [HttpPut("{username}")]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ReservationBasket), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ReservationBasket>> UpdateReservations(string username, [FromBody] Reservation reservation)
        {
            try
            {
                var coupon = await _couponGrpcService.GetDiscount(reservation.MovieTitle);
                reservation.Price -= reservation.Price * coupon.Amount/100;

            }
            catch (RpcException e)
            {
                _logger.LogInformation("Error while retrieving coupon for movie {MovieTtitle}: {msg}", reservation.MovieTitle, e.Message);
            }
            try
            {
                var projection = await _projectionGrpcService.GetProjection(reservation.ProjectionId);
                var reservations = await _repository.GetMovieReservations(username, reservation.MovieId);
                var reservationItem = reservations[reservation.ProjectionId];

                var numberOfSeats = reservation.NumberOfTickets - reservationItem.NumberOfTickets;
                var sucessfullyUpdatedNumberOfReservedSeats = await _projectionGrpcService.UpdateProjection(projection.Id, numberOfSeats);
                if (!sucessfullyUpdatedNumberOfReservedSeats.Updated)
                {
                    _logger.LogInformation("There is no enough seats");
                    return BadRequest();
                }
            }
            catch (RpcException e)
            {
                _logger.LogInformation("Error while retrieving projection for movie {MovieTtitle}: {msg}", reservation.MovieTitle, e.Message);
            }

            return Ok(await _repository.UpdateReservations(username, reservation));
        }

        [HttpDelete("[action]/{username}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteReservations(string username)
        {
            ReservationBasket reservationBasket = await _repository.GetReservations(username);
            foreach (var reservationDict in reservationBasket.Reservations.Values)
            {
                foreach (var reservation in reservationDict.Values)
                {
                    try
                    {
                        var projection = await _projectionGrpcService.GetProjection(reservation.ProjectionId);
                        var sucessfullyUpdatedNumberOfReservedSeats = await _projectionGrpcService.UpdateProjection(projection.Id, - reservation.NumberOfTickets);
                    }
                    catch (RpcException e)
                    {
                        _logger.LogInformation("Error while retrieving projection for movie {MovieTtitle}: {msg}", reservation.MovieTitle, e.Message);
                    }
                }
            }

            await _repository.DeleteReservations(username);
            return Ok();
        }

        [HttpDelete("[action]/username/{username}/movieId/{movieId}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteMovieReservations(string username, string movieId)
        {
            ReservationBasket reservationBasket = await _repository.GetReservations(username);
            foreach (var reservation in reservationBasket.Reservations[movieId])
            {
                try
                { 
                    var projection = await _projectionGrpcService.GetProjection(reservation.Value.ProjectionId);
                    var sucessfullyUpdatedNumberOfReservedSeats = await _projectionGrpcService.UpdateProjection(projection.Id, -reservation.Value.NumberOfTickets);
                }
                catch (RpcException e)
                {
                    _logger.LogInformation("Error while retrieving projection for movie {MovieTtitle}: {msg}", reservation.Value.MovieTitle, e.Message);
                }
            }

            await _repository.DeleteMovieReservations(username, movieId);
            return Ok();
        }

        [HttpDelete("[action]/{username}")]
        [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteReservation(string username, [FromBody] Reservation reservation)
        {
            try
            {
                var projection = await _projectionGrpcService.GetProjection(reservation.ProjectionId);
                var sucessfullyUpdatedNumberOfReservedSeats = await _projectionGrpcService.UpdateProjection(projection.Id, -reservation.NumberOfTickets);
            }
            catch (RpcException e)
            {
                _logger.LogInformation("Error while retrieving projection for movie {MovieTtitle}: {msg}", reservation.MovieTitle, e.Message);
            }
            await _repository.DeleteReservation(username, reservation);
            return Ok();
        }

        [HttpPost("[action]")]
        [ProducesResponseType(typeof(void), StatusCodes.Status202Accepted)]
        [ProducesResponseType(typeof(void), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Checkout([FromBody] ReservationBasketCheckout basketCheckout)
        {
            // Get existing basket
            var reservationBasket = await _repository.GetReservations(basketCheckout.BuyerUsername);
            if (reservationBasket == null)
            {
                return BadRequest();
            }

            // Send checkout event
            var eventMessage = _mapper.Map<ReservationBasketCheckoutEvent>(basketCheckout);
            await _publishEndpoint.Publish(eventMessage);

            // Remove the basket
            await _repository.DeleteReservations(basketCheckout.BuyerUsername);

            return Accepted(); 
        }

    }
}