using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Projections.Common.Entities;

namespace Projections.Common.Repositories
{
    public interface IProjectionRepository
    {
        Task<IEnumerable<Projection>> GetProjections();
        Task<IEnumerable<Projection>> GetProjectionsByDate(string date);
        Task<IEnumerable<Projection>> GetMovieProjections(string movieId);
        Task<IEnumerable<Projection>> GetMovieProjectionsByTitle(string movieId);
        Task<Projection> GetProjection(string id);
        Task CreateProjection(Projection projection);
        Task<bool> UpdateProjection(Projection projection);
        Task<bool> DeleteProjection(string id);
        Task<bool> DeleteProjectionsByMovieTitle(string movieId);
        Task<bool> DeleteProjectionsByDate(string date);
        Task<bool> DeleteProjections();
    }
}
