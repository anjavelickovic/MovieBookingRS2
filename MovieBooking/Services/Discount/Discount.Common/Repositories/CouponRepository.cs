﻿using AutoMapper;
using Dapper;
using Discount.Common.Data;
using Discount.Common.DTOs;
using Discount.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Discount.Common.Repositories
{
    public class CouponRepository : ICouponRepository
    {
        private readonly ICouponContext _context;
        private readonly IMapper _mapper;

        public CouponRepository(ICouponContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<CouponDTO>> GetDiscounts()
        {
            using var connection = _context.GetConnection();
            
            var coupons = await connection.QueryAsync<Coupon>("SELECT * FROM Coupon");

            var r = new Random();
            return _mapper.Map<IEnumerable<CouponDTO>>(coupons);
           }

        public async Task<CouponDTO> GetDiscount(string movieName)
        {
            using var connection = _context.GetConnection();
            var coupon = await connection.QueryFirstOrDefaultAsync<Coupon>(
                "SELECT * FROM Coupon WHERE MovieName = @MovieName", new { movieName });

            return _mapper.Map<CouponDTO>(coupon);
        }

        public async Task<bool> CreateDiscount(CreateCouponDTO couponDTO)
        {
            using var connection = _context.GetConnection();

            var affected = await connection.ExecuteAsync(
                "INSERT INTO Coupon (MovieId, MovieName, Amount, CreationDate) VALUES (@MovieId, @MovieName, @Amount, @CreationDate)",
                new { couponDTO.MovieId, couponDTO.MovieName, couponDTO.Amount, CreationDate = DateTime.Now });

            return affected != 0;
        }

        public async Task<bool> UpdateDiscount(UpdateCouponDTO couponDTO)
        {
            using var connection = _context.GetConnection();

            var affected = await connection.ExecuteAsync(
                "UPDATE Coupon SET Amount = @Amount, ModifiedDate = @ModifiedDate WHERE MovieId = @MovieId",
                new { couponDTO.Amount, ModifiedDate = DateTime.Now, couponDTO.MovieId });

            if (affected == 0)
                return false;

            return true;
        }

        public async Task<bool> DeleteDiscount(string MovieName)
        {
            using var connection = _context.GetConnection();

            var affected = await connection.ExecuteAsync(
                "DELETE FROM Coupon WHERE MovieName = @MovieName",
                new { MovieName = MovieName });

            if (affected == 0)
                return false;

            return true;
        }

        public async Task<IEnumerable<CouponDTO>> GetRandomDiscounts(int numberOfDiscounts)
        {
            using var connection = _context.GetConnection();

            var allCoupons = await connection.QueryAsync<Coupon>("SELECT * FROM Coupon");
            if (allCoupons.Count() <= numberOfDiscounts)
            {
                return _mapper.Map<IEnumerable<CouponDTO>>(allCoupons);
            }

            var r = new Random();
            return _mapper.Map<IEnumerable<CouponDTO>>(allCoupons
                .Select(c => new { Number = r.Next(), Item = c })
                .OrderBy(obj => obj.Number)
                .Select(obj => obj.Item)
                .Take(numberOfDiscounts));
        }

        
    }
}
