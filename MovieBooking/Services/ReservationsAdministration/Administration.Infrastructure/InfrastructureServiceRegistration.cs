using Administration.Application.Contracts.Factories;
using Administration.Application.Contracts.Infrastructure;
using Administration.Application.Contracts.Persistence;
using Administration.Application.Models;
using Administration.Infrastructure.Factories;
using Administration.Infrastructure.Mail;
using Administration.Infrastructure.Persistence;
using Administration.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Administration.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ReservationContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("AdministrationConnectionString")));

            services.AddScoped(typeof(IAsyncRepository<>), typeof(RepositoryBase<>));
            services.AddScoped<IReservationRepository, ReservationRepository>();

            services.AddScoped<IReservationFactory, ReservationFactory>();
            services.AddScoped<IReservationViewModelFactory, ReservationViewModelFactory>();

            services.Configure<EmailSettings>(c =>
            {
                var config = configuration.GetSection("EmailSettings");
                c.Mail = config["Mail"];
                c.DisplayName = config["DisplayName"];
                c.Password = config["Password"];
                c.Host = config["Host"];
                c.Port = int.Parse(config["Port"]);
            });
            services.AddTransient<IEmailService, EmailService>();

            return services;
        }
    }
}