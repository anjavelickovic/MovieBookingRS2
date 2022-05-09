using Identity.Context;
using Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection ConfigurePersistence(this IServiceCollection services, IConfiguration configuration)
        {
            var serverName = configuration.GetConnectionString("IdentityServerName");

            var mysqlDatabase = Environment.GetEnvironmentVariable("MYSQL_DATABASE");
            var mysqlUser = Environment.GetEnvironmentVariable("MYSQL_USER");
            var mysqlPassword = Environment.GetEnvironmentVariable("MYSQL_PASSWORD");

            var connectionString = $"server={serverName};user={mysqlUser};password={mysqlPassword};database={mysqlDatabase}";
            var serverVersion = ServerVersion.AutoDetect(connectionString);

            services.AddDbContext<IdentityContext>(dbContextOptions =>
                    dbContextOptions.UseMySql(connectionString, serverVersion)
            );

            return services;
        }

        public static IServiceCollection ConfigureIdentity(this IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 8;
                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<IdentityContext>()
                .AddDefaultTokenProviders();

            return services;
        }
    }
}
