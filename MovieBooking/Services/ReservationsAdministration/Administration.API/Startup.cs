using Administration.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Administration.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using EventBus.Messages.Constants;
using System.Reflection;
using Administration.API.EventBusConsumers;

namespace Administration.API
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
            services.AddApplicationServices();
            services.AddInfrastructureServices(Configuration);

            // AutoMapper
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            // EventBus
            services.AddMassTransit(config =>
            {
                config.AddConsumer<ReservationBasketCheckoutConsumer>();
                config.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host(Configuration["EventBusSettings:HostAddress"]);
                    cfg.ReceiveEndpoint(EventBusConstants.ReservationBasketCheckoutQueue, c =>
                    {
                        c.ConfigureConsumer<ReservationBasketCheckoutConsumer>(ctx);
                    });
                }); 
            });
            services.AddMassTransitHostedService();

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Administration.API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Administration.API v1"));
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