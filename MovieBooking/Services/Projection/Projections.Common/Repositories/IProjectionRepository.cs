using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Projections.Common.Entities;

namespace Projections.Common.Repositories
{
    public interface IProjectionRepository
    {
        Task<IEnumerable<Projection>> GetMovieProjections(string movieId);
        Task<Projection> GetProjection(string id);
        Task CreateProjection(Projection projection);
        Task<bool> UpdateProjection(Projection projection);
        Task<bool> DeleteProjection(string id);
    }
}
