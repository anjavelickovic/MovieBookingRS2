using Administration.API.Extensions;
using Administration.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace Administration.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args)
               .Build()
               .MigrateDatabase<ReservationContext>((context, services) =>
               {
                   var logger = services.GetService<ILogger<ReservationContextSeed>>();
                   ReservationContextSeed.SeedAsync(context, logger).Wait();
               })
               .Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
