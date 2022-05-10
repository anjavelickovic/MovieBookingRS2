using System;
using MongoDB.Driver;
using Projections.Common.Entities;

namespace Projections.Common.Data
{
    public interface IProjectionContext
    {
        IMongoCollection<Projection> Projections { get; }
    }
}