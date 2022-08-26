using Administration.Domain.Aggregates;
using Administration.Domain.ValueObjects;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Persistence
{
    public class ReservationContextSeed
    {
        public static async Task SeedAsync(ReservationContext reservationContext, ILogger<ReservationContextSeed> logger)
        {
            if (!reservationContext.Reservations.Any())
            {
                reservationContext.Reservations.AddRange(GetPreconfiguredReservations());
                await reservationContext.SaveChangesAsync();
                logger.LogInformation("Seeding database, context: {DbContextName}", nameof(ReservationContext));
            }
        }

        private static IEnumerable<Reservation> GetPreconfiguredReservations()
        {
            var reservation1 = new Reservation("buyerUserName",
                new PhoneNumber("+381", "629876543"), "rs2@gmail.com");
            reservation1.AddTicketReservation("projectionId", "projectionDate", "projectionTerm","movieName", "movieId", "HallId", "HallName", 100, 2);
            reservation1.AddTicketReservation("projectionId2", "projectionDate", "projectionTerm", "movieName2", "movieId2", "HallId2", "HallName2", 100, 5);

            return new List<Reservation> { reservation1 };
        }
    }
}
