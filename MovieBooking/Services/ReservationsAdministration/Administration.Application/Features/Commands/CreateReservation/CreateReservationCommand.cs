using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Administration.Application.Features.Commands.DTOs;

namespace Administration.Application.Features.Commands.CreateReservation
{
    public class CreateReservationCommand : IRequest<int>
    {
        public string BuyerId { get; private set; }
        public string BuyerUsername { get; private set; }
        public string Email { get; set; }
        public IEnumerable<TicketDTO> Tickets { get; set; }
        
        //phoneNumber
        public string AreaCode { get; private set; }
        public string Number { get; private set; }

    }
}
