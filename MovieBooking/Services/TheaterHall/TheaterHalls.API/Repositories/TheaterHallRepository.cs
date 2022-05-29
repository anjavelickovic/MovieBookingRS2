using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using TheaterHalls.API.Data;
using TheaterHalls.API.Entities;

namespace TheaterHalls.API.Repositories
{
    public class TheaterHallRepository : ITheaterHallRepository
    {
        private readonly ITheaterHallContext _context;

        public TheaterHallRepository(ITheaterHallContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<TheaterHall>> GetTheaterHalls()
        {
            return await _context.TheaterHalls.Find(p => true).ToListAsync();
        }

        public async Task<TheaterHall> GetTheaterHall(string id)
        {
            return await _context.TheaterHalls.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateTheaterHall(TheaterHall theaterHall)
        {
            await _context.TheaterHalls.InsertOneAsync(theaterHall);
        }

        public async Task<bool> UpdateTheaterHall(TheaterHall theaterHall)
        {
            var updateResult = await _context.TheaterHalls.ReplaceOneAsync(p => p.Id == theaterHall.Id, theaterHall);
            return updateResult.IsAcknowledged && updateResult.ModifiedCount > 0;
        }

        public async Task<bool> DeleteTheaterHall(string id)
        {
            var deleteResult = await _context.TheaterHalls.DeleteOneAsync(p => p.Id == id);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }
    }
}
