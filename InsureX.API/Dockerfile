FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["InsureX.API/InsureX.API.csproj", "InsureX.API/"]
COPY ["InsureX.Application/InsureX.Application.csproj", "InsureX.Application/"]
COPY ["InsureX.Domain/InsureX.Domain.csproj", "InsureX.Domain/"]
COPY ["InsureX.Infrastructure/InsureX.Infrastructure.csproj", "InsureX.Infrastructure/"]
COPY ["InsureX.Shared/InsureX.Shared.csproj", "InsureX.Shared/"]
RUN dotnet restore "InsureX.API/InsureX.API.csproj"
COPY . .
WORKDIR "/src/InsureX.API"
RUN dotnet build "InsureX.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InsureX.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InsureX.API.dll"]
