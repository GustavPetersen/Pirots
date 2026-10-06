FROM mcr.microsoft.com/dotnet/sdk:9.0 AS development
WORKDIR /src

# Cache restore
COPY *.csproj ./
RUN dotnet restore

# Copy source
COPY . .

# Start dotnet server
CMD ["dotnet", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:3000"]
