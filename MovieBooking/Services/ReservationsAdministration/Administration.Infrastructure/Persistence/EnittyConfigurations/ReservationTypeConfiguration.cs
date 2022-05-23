using Administration.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Persistence.EnittyConfigurations
{
    public class ReservationTypeConfiguration : IEntityTypeConfiguration<Reservation>
    {
        public void Configure(EntityTypeBuilder<Reservation> builder)
        {
            builder.ToTable("Reservations");
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Id).UseHiLo("reservationsequence");

            builder.OwnsOne(r => r.PhoneNumber, n => {
                n.Property<int>("ReservationId").UseHiLo("reservationsequence");
                n.WithOwner();
             });

            var navigation = builder.Metadata.FindNavigation(nameof(Reservation.TicketReservations));
            navigation.SetPropertyAccessMode(PropertyAccessMode.Field);

        }
    }
}
