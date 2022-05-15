using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using Projections.Common.Data;
using Projections.Common.Entities;

namespace Projections.Common.Repositories
{
    public class ProjectionRepository : IProjectionRepository
    {
        private readonly IProjectionContext _context;

        public ProjectionRepository(IProjectionContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Projection>> GetProjections()
        {
            return await _context.Projections.Find(p => true).ToListAsync();
        }

        public async Task<IEnumerable<Projection>> GetProjectionsByDate(string date)
        {
            return await _context.Projections.Find(p => p.ProjectionDate == date).ToListAsync();
        }

        public async Task<IEnumerable<Projection>> GetMovieProjections(string movieId)
        {
            return await _context.Projections.Find(p => p.MovieId == movieId).ToListAsync();
        }

        public async Task<Projection> GetProjection(string id)
        {
            return await _context.Projections.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateProjection(Projection projection)
        {
            Task<IEnumerable<Projection>> projections = GetProjections();
            foreach (Projection projectionItem in await projections)
            {
                if (projectionItem.TheaterHallId.Equals(projection.TheaterHallId) &&
                    projectionItem.ProjectionDate.Equals(projection.ProjectionDate) &&
                    projectionItem.ProjectionTerm.Equals(projection.ProjectionTerm))
                {
                    throw new Exception("This term is not available");
                }
            }
            await _context.Projections.InsertOneAsync(projection);
        }

        public async Task<bool> UpdateProjection(Projection projection)
        {
            IEnumerable<Projection> projections = _context.Projections.Find(p => p.Id == projection.Id).ToList();
            foreach (Projection projectionItem in projections)
            {
                if (!projectionItem.Id.Equals(projection.Id) &&
                    projectionItem.TheaterHallId.Equals(projection.TheaterHallId) &&
                    projectionItem.ProjectionDate.Equals(projection.ProjectionDate) &&
                    projectionItem.ProjectionTerm.Equals(projection.ProjectionTerm))
                {
                    return false;
                }
            }

            var updateResult = await _context.Projections.ReplaceOneAsync(p => p.Id == projection.Id, projection);
            return updateResult.IsAcknowledged && updateResult.ModifiedCount > 0;
        }

        public async Task<bool> DeleteProjection(string id)
        {
            var deleteResult = await _context.Projections.DeleteOneAsync(p => p.Id == id);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }

        public async Task<bool> DeleteMovieProjections(string movieId)
        {
            var deleted = true;
            var projections = await GetMovieProjections(movieId);
            foreach (var projection in projections)
            {
                var deleteResult =  await _context.Projections.DeleteOneAsync(p => p.Id == projection.Id);
                deleted = deleted && deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
            }
            return deleted;
        }

        public async Task<bool> DeleteProjections()
        {
            var deleted = true;
            var projections = await GetProjections();
            foreach (var projection in projections)
            {
                var deleteResult = await _context.Projections.DeleteOneAsync(p => p.Id == projection.Id);
                deleted = deleted && deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
            }
            return deleted;
        }
    }
}
