using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Reservations.API.Entities;

namespace Reservations.API.Repositories
{
    public class ReservationsRepository: IReservationsRepository
    {
        private readonly IDistributedCache _cache;

        public ReservationsRepository(IDistributedCache cache)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<ReservationBasket> GetReservations(string username)
        {
            var basket = await _cache.GetStringAsync(username);
            if (string.IsNullOrEmpty(basket))
            {
                return null;
            }
            return JsonConvert.DeserializeObject<ReservationBasket>(basket);
        }

        public async Task<ReservationBasket> UpdateReservations(ReservationBasket basket)
        {
            var basketString = JsonConvert.SerializeObject(basket);
            await _cache.SetStringAsync(basket.Username, basketString);
            return await GetReservations(basket.Username);
        }

        public async Task DeleteReservations(string username)
        {
            await _cache.RemoveAsync(username);
        }
    }
}
