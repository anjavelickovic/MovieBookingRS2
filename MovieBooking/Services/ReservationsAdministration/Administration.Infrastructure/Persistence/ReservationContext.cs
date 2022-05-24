using Administration.Domain.Aggregates;
using Administration.Infrastructure.Persistence.EnittyConfigurations;
using Microsoft.EntityFrameworkCore;
using Ordering.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Administration.Infrastructure.Persistence
{
    public class ReservationContext : DbContext
    {
        protected ReservationContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Reservation> Reservations { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {

            foreach (var entry in ChangeTracker.Entries<EntityBase>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = "foo";
                        entry.Entity.CreatedDate = DateTime.Now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModifiedBy = "foo";
                        entry.Entity.LastModifiedDate = DateTime.Now;
                        break;                    
                }
            }

            // ovaj poziv cuva podatke u bazu
            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ReservationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new TicketEntityTypeConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
