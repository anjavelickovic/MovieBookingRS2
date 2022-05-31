using System;
using MassTransit;
using MediatR;
using EventBus.Messages.Events;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Administration.Application.Features.Commands.CreateReservation;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Administration.API.EventBusConsumers
{
    public class ReservationBasketCheckoutConsumer : IConsumer<ReservationBasketCheckoutEvent>
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly ILogger<ReservationBasketCheckoutConsumer> _logger;


        public ReservationBasketCheckoutConsumer(IMediator mediator, IMapper mapper, ILogger<ReservationBasketCheckoutConsumer> logger)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task Consume(ConsumeContext<ReservationBasketCheckoutEvent> context)
        {
            var command = _mapper.Map<CreateReservationCommand>(context.Message);
            var id = await _mediator.Send(command);

            _logger.LogInformation($"{typeof(ReservationBasketCheckoutEvent).Name} consumed successfully. Created reservation id: {id}");
        }
    }
}