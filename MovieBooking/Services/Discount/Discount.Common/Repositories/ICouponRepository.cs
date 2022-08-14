using Discount.Common.DTOs;
using Discount.Common.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Discount.Common.Repositories
{
    public interface ICouponRepository
    {
        Task<IEnumerable<CouponDTO>> GetDiscounts();
        Task<CouponDTO> GetDiscount(string movieName);
        Task<bool> CreateDiscount(CreateCouponDTO couponDTO);
        Task<bool> UpdateDiscount(UpdateCouponDTO couponDTO);
        Task<bool> DeleteDiscount(string id);
        Task<IEnumerable<CouponDTO>> GetRandomDiscounts(int numberOfDiscounts);

    }
}