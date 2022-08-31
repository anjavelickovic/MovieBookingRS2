using Discount.Common.DTOs;
using Discount.Common.Entities;
using Discount.Common.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Discount.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DiscountController : ControllerBase
    {
    
        private readonly ICouponRepository _repository;

        public DiscountController(ICouponRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet()]
        [ProducesResponseType(typeof(CouponDTO), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CouponDTO>>> GetDiscounts(){
            var discounts = await _repository.GetDiscounts();
            return Ok(discounts);
        }

        [HttpGet("{movieName}")]
        [ProducesResponseType(typeof(CouponDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(void), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CouponDTO>> GetDiscount(string movieName)
        {
            var coupon = await _repository.GetDiscount(movieName);
            if (coupon == null)
            {
                return NotFound();
            }
            return Ok(coupon);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ProducesResponseType(typeof(CouponDTO), StatusCodes.Status201Created)]
        public async Task<ActionResult<CouponDTO>> CreateDiscount([FromBody] CreateCouponDTO couponDTO)
        {
            await _repository.CreateDiscount(couponDTO);
            var coupon = await _repository.GetDiscount(couponDTO.MovieName);
            return CreatedAtAction("GetDiscount", new { movieName = coupon.MovieName }, coupon);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> UpdateDiscount([FromBody] UpdateCouponDTO coupon)
        {
            return Ok(await _repository.UpdateDiscount(coupon));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{movieName}", Name = "DeleteDiscount")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteDiscount(string movieName)
        {
            return Ok(await _repository.DeleteDiscount(movieName));
        }
    }
}