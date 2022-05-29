using System;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using TheaterHalls.API.Entities;

namespace TheaterHalls.API.Data
{
    public class TheaterHallContext : ITheaterHallContext
    {
        public TheaterHallContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetValue<string>("DatabaseSettings:ConnectionString"));
            var database = client.GetDatabase("TheaterHallDB");
            TheaterHalls = database.GetCollection<TheaterHall>("TheaterHall");
        }

        public IMongoCollection<TheaterHall> TheaterHalls { get; }
    }
}
