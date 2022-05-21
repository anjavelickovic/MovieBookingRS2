using Administration.Application.Features.Queries.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Features.Queries.GetListOfReservations
{
    public class GetListOfReservationsQuery : IRequest<List<ReservationViewModel>>
    {
        public string Username { get; set; }

        public GetListOfReservationsQuery(string username)
        {
            Username = username ?? throw new ArgumentNullException(nameof(username));
        }
    }
}
