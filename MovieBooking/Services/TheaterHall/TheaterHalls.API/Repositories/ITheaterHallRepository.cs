using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheaterHalls.API.Entities;

namespace TheaterHalls.API.Repositories
{
    public interface ITheaterHallRepository
    {
        Task<IEnumerable<TheaterHall>> GetTheaterHalls();
        Task<TheaterHall> GetTheaterHall(string id);
        Task CreateTheaterHall(TheaterHall theaterHall);
        Task<bool> UpdateTheaterHall(TheaterHall theaterHall);
        Task<bool> DeleteTheaterHall(string id);
    }
}
