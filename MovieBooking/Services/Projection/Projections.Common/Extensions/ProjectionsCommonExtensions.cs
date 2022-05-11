using System;
using Microsoft.Extensions.DependencyInjection;
using Projections.Common.Data;
using Projections.Common.Repositories;

namespace Projections.Common.Extensions
{
    public static class ProjectionsCommonExtensions
    {
        public static void AddProjectionsCommonServices(this IServiceCollection services)
        {
            services.AddScoped<IProjectionContext, ProjectionContext>();
            services.AddScoped<IProjectionRepository, ProjectionRepository>();
        }
    }
}
