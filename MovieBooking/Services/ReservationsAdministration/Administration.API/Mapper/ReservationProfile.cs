using AutoMapper;
using Administration.Application.Features.Commands.CreateReservation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Administration.API.Mapper
{
    public class ReservationProfile : Profile
    {
        public ReservationProfile()
        {
            CreateMap<CreateReservationCommand, EventBus.Messages.Events.ReservationBasketCheckoutEvent>().ReverseMap();
            CreateMap<Administration.Application.Features.Commands.DTOs.TicketDTO, EventBus.Messages.Events.ReservationItem>().ReverseMap();
        }
    }
}
