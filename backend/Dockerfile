FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /src

# Cache restore
COPY *.csproj ./
RUN dotnet restore

# Copy source
COPY . .

# Expose dotnet server port
EXPOSE 5000

# Start dotnet server
CMD ["dotnet", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:5000"]
