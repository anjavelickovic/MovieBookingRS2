using System;
using System.Threading.Tasks;
using Projections.GRPC.Protos;

namespace Reservations.API.GrpcServices
{
    public class ProjectionGrpcService
    {
        private readonly ProjectionProtoService.ProjectionProtoServiceClient _projectionProtoServiceClient;

        public ProjectionGrpcService(ProjectionProtoService.ProjectionProtoServiceClient projectionProtoServiceClient)
        {
            _projectionProtoServiceClient = projectionProtoServiceClient ?? throw new ArgumentNullException(nameof(projectionProtoServiceClient));
        }

        public async Task<GetProjectionResponse> GetProjection(string projectionId)
        {
            var projectionRequest = new GetProjectionRequest();
            projectionRequest.Id = projectionId;
            return await _projectionProtoServiceClient.GetProjectionAsync(projectionRequest);
        }

        public async Task<UpdateProjectionResponse> UpdateProjection(string projectionId, int numberOfSeats)
        {
            var projectionRequest = new UpdateProjectionRequest();
            projectionRequest.Id = projectionId;
            projectionRequest.NumberOfSeats = numberOfSeats;
            return await _projectionProtoServiceClient.UpdateProjectionAsync(projectionRequest);
        }
    }
}