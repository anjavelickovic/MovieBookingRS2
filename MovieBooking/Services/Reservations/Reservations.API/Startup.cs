using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Discount.GRPC.Protos;
using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Projections.GRPC.Protos;
using Reservations.API.GrpcServices;
using Reservations.API.Repositories;
using Reservations.API.Entities;
using EventBus.Messages.Events;

namespace Reservations.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = Configuration.GetValue<string>("CacheSettings:ConnectionString");
            });

            services.AddScoped<IReservationsRepository, ReservationsRepository>();

            services.AddAutoMapper(configuration =>
            {
                configuration.CreateMap<bool, UpdateProjectionResponse>().ReverseMap();
                configuration.CreateMap<ReservationBasketCheckout, ReservationBasketCheckoutEvent>().ReverseMap();
                configuration.CreateMap<ReservationItem, Reservation>().ReverseMap();
            });

            //GRPC
            services.AddGrpcClient<CouponProtoService.CouponProtoServiceClient>(
                options => options.Address = new Uri(Configuration["GrpcSettings:DiscountUrl"]));
            services.AddScoped<CouponGrpcService>();

            services.AddGrpcClient<ProjectionProtoService.ProjectionProtoServiceClient>(
                options => options.Address = new Uri(Configuration["GrpcSettings:ProjectionUrl"]));
            services.AddScoped<ProjectionGrpcService>();

            // EventBus
            services.AddMassTransit(config =>
            {
                config.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host(Configuration["EventBusSettings:HostAddress"]);
                });
            });
            services.AddMassTransitHostedService();

            //
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Reservations.API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Reservations.API v1"));
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
