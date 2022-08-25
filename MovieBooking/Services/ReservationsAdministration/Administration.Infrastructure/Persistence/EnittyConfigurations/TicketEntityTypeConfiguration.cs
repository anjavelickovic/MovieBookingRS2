using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Persistence.EnittyConfigurations
{
    public class TicketEntityTypeConfiguration : IEntityTypeConfiguration<TicketReservation>
    {
        public void Configure(EntityTypeBuilder<TicketReservation> builder)
        {
            builder.ToTable("Tickets");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id).UseHiLo("ticketsequence");

            builder.Property<string>("MovieId")
                .HasColumnType("VARCHAR(24)")
                .IsRequired();

        }
    }
}
