using Administration.Application.Contracts.Factories;
using Administration.Application.Contracts.Infrastructure;
using Administration.Application.Contracts.Persistence;
using Administration.Application.Models;
using Administration.Domain.Aggregates;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Administration.Application.Features.Commands.CreateReservation
{
    class CreateReservationCommandHandler : IRequestHandler<CreateReservationCommand, int>
    {
        private readonly IReservationRepository _repository;
        private readonly IReservationFactory _factory;
        private readonly IEmailService _emailService;
        private readonly ILogger<CreateReservationCommandHandler> _logger;

        public CreateReservationCommandHandler(IReservationRepository repository, IReservationFactory factory, IEmailService emailService, ILogger<CreateReservationCommandHandler> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _factory = factory ?? throw new ArgumentNullException(nameof(factory));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<int> Handle(CreateReservationCommand request, CancellationToken cancellationToken)
        {
            var reservationEntity = _factory.Create(request);
            var newReservation = await _repository.AddAsync(reservationEntity);

            _logger.LogInformation($"Reservation {newReservation.Id} is successfully created");

            await SendMail(newReservation);

            return newReservation.Id;
        }

        private async Task SendMail(Reservation newReservation)
        {
            var email = new Email { 
                To = newReservation.Email, 
                Subject = $"Reservation with id {newReservation.Id} is successfully created",
                Body = $"You're reservation was successfully created."
            };

            try
            {
                await _emailService.SendEmail(email);
                _logger.LogInformation($"Sending email for reservation {newReservation.Id} was successful");

            } catch (Exception e)
            {
                _logger.LogInformation($"Sending email for reservation {newReservation.Id} failed: {e.Message}");
            }

        }
    }
}
