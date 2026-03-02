   # Dockerfile
   FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
   WORKDIR /app
   EXPOSE 80
   EXPOSE 443

   FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
   WORKDIR /src
   COPY ["Insurex.Api/Insurex.Api.csproj", "Insurex.Api/"]
   COPY ["Insurex.Domain/Insurex.Domain.csproj", "Insurex.Domain/"]
   COPY ["Insurex.Infrastructure/Insurex.Infrastructure.csproj", "Insurex.Infrastructure/"]
   RUN dotnet restore "Insurex.Api/Insurex.Api.csproj"
   COPY . .
   WORKDIR "/src/Insurex.Api"
   RUN dotnet build "Insurex.Api.csproj" -c Release -o /app/build

   FROM build AS publish
   RUN dotnet publish "Insurex.Api.csproj" -c Release -o /app/publish

   FROM base AS final
   WORKDIR /app
   COPY --from=publish /app/publish .
   ENTRYPOINT ["dotnet", "Insurex.Api.dll"]