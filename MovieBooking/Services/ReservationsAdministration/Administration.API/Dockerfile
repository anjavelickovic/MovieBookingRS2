#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Services/ReservationsAdministration/Administration.API/Administration.API.csproj", "Services/ReservationsAdministration/Administration.API/"]
COPY ["Services/ReservationsAdministration/Administration.Application/Administration.Application.csproj", "Services/ReservationsAdministration/Administration.Application/"]
COPY ["Services/ReservationsAdministration/Administration.Domain/Administration.Domain.csproj", "Services/ReservationsAdministration/Administration.Domain/"]
COPY ["Services/ReservationsAdministration/Administration.Infrastructure/Administration.Infrastructure.csproj", "Services/ReservationsAdministration/Administration.Infrastructure/"]
RUN dotnet restore "Services/ReservationsAdministration/Administration.API/Administration.API.csproj"
COPY . .
WORKDIR "/src/Services/ReservationsAdministration/Administration.API"
RUN dotnet build "Administration.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Administration.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Administration.API.dll"]
