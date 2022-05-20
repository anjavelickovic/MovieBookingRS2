using Administration.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Contracts.Persistence
{
    public interface IAsyncRepository<T> where T : AggregateRoot
    {
        Task<IReadOnlyList<T>> GetAllAsync();

        Task<IReadOnlyList<T>> GetAsync(Expression<Func<T, bool>> predicate);

        // dosta drugih metoda koje treba dodati: update, delete....
    }
}
