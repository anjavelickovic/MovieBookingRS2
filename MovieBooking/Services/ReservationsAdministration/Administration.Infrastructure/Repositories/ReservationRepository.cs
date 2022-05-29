using Administration.Application.Contracts.Persistence;
using Administration.Domain.Aggregates;
using Administration.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Repositories
{
    public class ReservationRepository : RepositoryBase<Reservation>, IReservationRepository
    {
        public ReservationRepository(ReservationContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Reservation>> GetReservationByUsername(string username)
        {
            return await _dbContext.Reservations
                .Where(r => r.BuyerUsername == username)
                .Include(r => r.TicketReservations)
                .ToListAsync();
        }
    }
}
