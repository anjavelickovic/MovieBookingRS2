using System;
using System.Threading.Tasks;
using AutoMapper;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Projections.Common.Repositories;
using Projections.GRPC.Protos;

namespace Projections.GRPC.Services
{
    public class ProjectionService : ProjectionProtoService.ProjectionProtoServiceBase
    {
        private readonly IProjectionRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<ProjectionService> _logger;

        public ProjectionService(IProjectionRepository repository, IMapper mapper, ILogger<ProjectionService> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public override async Task<GetProjectionResponse> GetProjection(GetProjectionRequest request, ServerCallContext context)
        {
            var projection = await _repository.GetProjection(request.Id);
            if (projection == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Projection {request.Id} is not found"));
            }

            _logger.LogInformation("Projection id: {id}", projection.Id);

            return _mapper.Map<GetProjectionResponse>(projection);
        }

        public override async Task<UpdateProjectionResponse> UpdateProjection(UpdateProjectionRequest request, ServerCallContext context)
        {
            var projection = await _repository.GetProjection(request.Id);
            if (projection == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Projection {request.Id} is not found"));
            }

            _logger.LogInformation("Updating projection id: {id}", projection.Id);

            projection.NumberOfReservedSeats = request.NumberOfSeats;
            var updated =  await _repository.UpdateProjection(projection);

            return _mapper.Map<UpdateProjectionResponse>(updated);
        }
    }
}
