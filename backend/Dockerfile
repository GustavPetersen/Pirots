FROM mcr.microsoft.com/dotnet/sdk:10.0 AS base
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore

FROM base AS development
COPY . .

ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:3000"]

FROM base AS build
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS production
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "backend.dll", "--urls", "http://0.0.0.0:3000"]

