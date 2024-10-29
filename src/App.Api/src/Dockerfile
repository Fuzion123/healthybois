FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=https://+:4001
EXPOSE 4001

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS publish
WORKDIR /src
COPY . .
RUN dotnet publish ./Api/WebApi.csproj -c Release -o /app

FROM base AS final
WORKDIR /app 
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "WebApi.dll"]