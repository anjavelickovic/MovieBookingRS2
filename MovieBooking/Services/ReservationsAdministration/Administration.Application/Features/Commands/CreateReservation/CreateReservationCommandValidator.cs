using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Application.Features.Commands.CreateReservation
{
    class CreateReservationCommandValidator : AbstractValidator<CreateReservationCommand>
    {
        public CreateReservationCommandValidator()
        {
            RuleFor(reservation => reservation.BuyerUsername)
                .NotEmpty().WithMessage("Username is required!")
                .NotNull()
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters!");

            RuleFor(reservation => reservation.Email)
                .NotEmpty().WithMessage("Email is required!");

            RuleForEach(reservation => reservation.Tickets)
                .Must(ticket => ticket.Price > 0).WithMessage("Price not correct");

        }
    }
}
