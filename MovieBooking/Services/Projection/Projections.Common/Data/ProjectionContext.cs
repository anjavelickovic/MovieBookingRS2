using System;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Projections.Common.Entities;

namespace Projections.Common.Data
{
    public class ProjectionContext : IProjectionContext
    {
        public ProjectionContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration.GetValue<string>("DatabaseSettings:ConnectionString"));
            var database = client.GetDatabase("ProjectionsDB");
            Projections = database.GetCollection<Projection>("Projection");
        }

        public IMongoCollection<Projection> Projections { get; }
    }
}
