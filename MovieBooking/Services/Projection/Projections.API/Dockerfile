#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Services/Projection/Projections.API/Projections.API.csproj", "Services/Projection/Projections.API/"]
COPY ["Services/Projection/Projections.Common/Projections.Common.csproj", "Services/Projection/Projections.Common/"]
RUN dotnet restore "Services/Projection/Projections.API/Projections.API.csproj"
COPY . .
WORKDIR "/src/Services/Projection/Projections.API"
RUN dotnet build "Projections.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Projections.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Projections.API.dll"]
