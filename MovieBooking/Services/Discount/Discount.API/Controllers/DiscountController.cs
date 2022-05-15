using Discount.Common.DTOs;
using Discount.Common.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Discount.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DiscountController : ControllerBase
    {
        private readonly ICouponRepository _repository;

        public DiscountController(ICouponRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpGet("{movieId}")]
        [ProducesResponseType(typeof(CouponDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CouponDTO>> GetDiscount(string movieId)
        {
            var coupon = await _repository.GetDiscount(movieId);
            if (coupon == null)
            {
                return NotFound();
            }
            return Ok(coupon);
        }

        [HttpPost]
        [ProducesResponseType(typeof(CouponDTO), StatusCodes.Status201Created)]
        public async Task<ActionResult<CouponDTO>> CreateDiscount([FromBody] CreateCouponDTO couponDTO)
        {
            await _repository.CreateDiscount(couponDTO);
            var coupon = await _repository.GetDiscount(couponDTO.MovieId);
            return CreatedAtAction("GetDiscount", new { movieId = coupon.MovieId }, coupon);
        }

        [HttpPut]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> UpdateDiscount([FromBody] UpdateCouponDTO coupon)
        {
            return Ok(await _repository.UpdateDiscount(coupon));
        }

        [HttpDelete("{movieId}", Name = "DeleteDiscount")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteDiscount(string movieId)
        {
            return Ok(await _repository.DeleteDiscount(movieId));
        }
    }
}