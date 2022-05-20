using Administration.Domain.Aggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Contracts.Persistence
{
    public interface IReservationRepository : IAsyncRepository<Reservation>
    {
        // stvari koje nisu toliko opsteg karaktera
        Task<IEnumerable<Reservation>> GetReservationByUsername(string username);
    }
}
