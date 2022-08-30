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

        public async Task<IEnumerable<Projection>> GetMovieProjectionsByTitle(string movieTitle)
        {
            return await _context.Projections.Find(p => p.MovieTitle == movieTitle).ToListAsync();
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

        public async Task<bool>UpdateProjection(Projection projection)
        {
            IEnumerable<Projection> projections = _context.Projections.Find(p => true).ToList();
            foreach (Projection projectionItem in projections)
            {
                if (!projectionItem.Id.Equals(projection.Id) &&
                    projectionItem.TheaterHallId.Equals(projection.TheaterHallId) &&
                    projectionItem.ProjectionDate.Equals(projection.ProjectionDate) &&
                    projectionItem.ProjectionTerm.Equals(projection.ProjectionTerm))
                {
                    throw new Exception("This term is not available");
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

        public async Task<bool> DeleteProjectionsByMovieTitle(string movieTitle)
        {
            var deleteResult = await _context.Projections.DeleteManyAsync(p => p.MovieTitle == movieTitle);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }

        public async Task<bool> DeleteProjectionsByDate(string date)
        {
            var deleteResult = await _context.Projections.DeleteManyAsync(p => p.ProjectionDate == date);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
            
        }

        public async Task<bool> DeleteProjections()
        {
            var deleteResult = await _context.Projections.DeleteManyAsync(p => true);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }
    }
}
