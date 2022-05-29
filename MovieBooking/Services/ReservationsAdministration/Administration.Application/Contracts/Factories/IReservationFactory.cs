using Administration.Application.Features.Commands.CreateReservation;
using Administration.Domain.Aggregates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Contracts.Factories
{
    public interface IReservationFactory
    {
        Reservation Create(CreateReservationCommand command);
    }
}
