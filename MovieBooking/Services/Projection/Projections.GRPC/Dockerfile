#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Services/Projection/Projections.GRPC/Projections.GRPC.csproj", "Services/Projection/Projections.GRPC/"]
COPY ["Services/Projection/Projections.Common/Projections.Common.csproj", "Services/Projection/Projections.Common/"]
RUN dotnet restore "Services/Projection/Projections.GRPC/Projections.GRPC.csproj"
COPY . .
WORKDIR "/src/Services/Projection/Projections.GRPC"
RUN dotnet build "Projections.GRPC.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Projections.GRPC.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Projections.GRPC.dll"]
