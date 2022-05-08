using System;
using System.Threading.Tasks;
using Discount.GRPC.Protos;

namespace Reservations.API.GrpcServices
{
    public class CouponGrpcService
    {
        private readonly CouponProtoService.CouponProtoServiceClient _couponProtoServiceClient;

        public CouponGrpcService(CouponProtoService.CouponProtoServiceClient couponProtoServiceClient)
        {
            _couponProtoServiceClient = couponProtoServiceClient ?? throw new ArgumentNullException(nameof(couponProtoServiceClient));
        }

        public async Task<GetDiscountResponse> GetDiscount(string movieTitle)
        {
            var discountRequest = new GetDiscountRequest();
            discountRequest.MovieName = movieTitle;
            return await _couponProtoServiceClient.GetDiscountAsync(discountRequest);
        }
    }
}
