using Discount.Common.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Discount.Common.Repositories
{
    public interface ICouponRepository
    {
        Task<CouponDTO> GetDiscount(string movieName);
        Task<bool> CreateDiscount(CreateCouponDTO couponDTO);
        Task<bool> UpdateDiscount(UpdateCouponDTO couponDTO);
        Task<bool> DeleteDiscount(string movieName);
        Task<IEnumerable<CouponDTO>> GetRandomDiscounts(int numberOfDiscounts);

    }
}