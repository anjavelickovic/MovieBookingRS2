using System;
using MongoDB.Driver;
using TheaterHalls.API.Entities;

namespace TheaterHalls.API.Data
{
    public interface ITheaterHallContext
    {
        IMongoCollection<TheaterHall> TheaterHalls { get; }
    }
}
