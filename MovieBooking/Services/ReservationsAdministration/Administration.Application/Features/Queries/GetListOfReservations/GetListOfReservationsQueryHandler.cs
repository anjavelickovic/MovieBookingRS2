using Administration.Application.Contracts.Factories;
using Administration.Application.Contracts.Persistence;
using Administration.Application.Features.Queries.ViewModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Administration.Application.Features.Queries.GetListOfReservations
{
    public class GetListOfReservationsQueryHandler : IRequestHandler<GetListOfReservationsQuery, List<ReservationViewModel>>
    {
        private readonly IReservationRepository _repository;
        private readonly IReservationViewModelFactory _factory;

        public GetListOfReservationsQueryHandler(IReservationRepository repository, IReservationViewModelFactory factory)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
        }

        public async Task<List<ReservationViewModel>> Handle(GetListOfReservationsQuery request, CancellationToken cancellationToken)
        {
            var reservationList = await _repository.GetReservationByUsername(request.Username);

            return reservationList.Select(reservation => _factory.CreateViewModel(reservation)).ToList();
        }
    }
}
