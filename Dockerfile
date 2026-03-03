# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY InsureX.sln ./
COPY InsureX.Domain/InsureX.Domain.csproj InsureX.Domain/
COPY InsureX.Application/InsureX.Application.csproj InsureX.Application/
COPY InsureX.Infrastructure/InsureX.Infrastructure.csproj InsureX.Infrastructure/
COPY InsureX.API/InsureX.API.csproj InsureX.API/

# Restore dependencies
RUN dotnet restore InsureX.API/InsureX.API.csproj

# Copy source code
COPY InsureX.Domain/ InsureX.Domain/
COPY InsureX.Application/ InsureX.Application/
COPY InsureX.Infrastructure/ InsureX.Infrastructure/
COPY InsureX.API/ InsureX.API/

# Build and publish
RUN dotnet publish InsureX.API/InsureX.API.csproj -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Copy published files
COPY --from=build /app/publish .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health/live || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "InsureX.API.dll"]
