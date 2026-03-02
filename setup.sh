   # setup.sh - Bash setup script for Linux/Mac
   #!/bin/bash

   set -e

   PROJECT_NAME="New-Insurex"
   GREEN='\033[0;32m'
   YELLOW='\033[1;33m'
   RED='\033[0;31m'
   NC='\033[0m' # No Color

   echo -e "${GREEN}🚀 Setting up Insurex Insurance Management Platform...${NC}"

   # Check prerequisites
   echo -e "${YELLOW}Checking prerequisites...${NC}"

   check_command() {
       if ! command -v $1 &> /dev/null; then
           echo -e "${RED}❌ $1 not found. Please install $1.${NC}"
           exit 1
       fi
   }

   check_command dotnet
   check_command docker
   check_command node
   check_command npm

   echo -e "${GREEN}✅ All prerequisites found${NC}"

   # Create project structure
   echo -e "${YELLOW}Creating project structure...${NC}"

   mkdir -p src/{Insurex.Api,Insurex.Domain/{Entities,Interfaces,Enums},Insurex.Infrastructure/{Data,Services,Migrations}}
   mkdir -p tests/{Insurex.UnitTests,Insurex.IntegrationTests}

   # Create solution and projects
   echo -e "${YELLOW}Creating solution and projects...${NC}"

   dotnet new sln -n $PROJECT_NAME -o . --force

   cd src

   dotnet new webapi -n Insurex.Api --framework net9.0
   dotnet new classlib -n Insurex.Domain --framework net9.0
   dotnet new classlib -n Insurex.Infrastructure --framework net9.0

   dotnet sln ../$PROJECT_NAME.sln add Insurex.Api/Insurex.Api.csproj
   dotnet sln ../$PROJECT_NAME.sln add Insurex.Domain/Insurex.Domain.csproj
   dotnet sln ../$PROJECT_NAME.sln add Insurex.Infrastructure/Insurex.Infrastructure.csproj

   # Add references
   dotnet add Insurex.Api reference Insurex.Domain Insurex.Infrastructure
   dotnet add Insurex.Infrastructure reference Insurex.Domain

   # Add NuGet packages
   echo -e "${YELLOW}Installing NuGet packages...${NC}"

   cd Insurex.Api
   dotnet add package MediatR
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   dotnet add package Microsoft.EntityFrameworkCore.Tools
   dotnet add package Swashbuckle.AspNetCore
   dotnet add package System.IdentityModel.Tokens.Jwt
   dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
   cd ..

   cd Insurex.Infrastructure
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   dotnet add package Microsoft.EntityFrameworkCore.Tools
   dotnet add package BCrypt.Net-Next
   dotnet add package MailKit
   cd ..

   cd ..

   # Setup frontend
   echo -e "${YELLOW}Setting up React frontend...${NC}"

   npx create-react-app frontend --template typescript
   cd frontend

   npm install @types/node @types/react @types/react-dom @types/jest typescript tailwindcss @headlessui/react @heroicons/react
   npm install react-router-dom @types/react-router-dom axios react-hook-form zod @hookform/resolvers recharts date-fns
   npm install @tanstack/react-query jest @testing-library/react @testing-library/jest-dom

   npx tailwindcss init -p

   cd ..

   # Create environment files
   cat > frontend/.env << EOF
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENVIRONMENT=development
   EOF

   cat > frontend/.env.production << EOF
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENVIRONMENT=production
   EOF

   echo -e "${GREEN}🎉 Setup complete!${NC}"
   echo -e "${YELLOW}Next steps:${NC}"
   echo "1. cd src/Insurex.Api"
   echo "2. Copy the source files from the generated code"
   echo "3. dotnet ef migrations add InitialCreate"
   echo "4. dotnet ef database update"
   echo "5. dotnet run"
   echo "6. In another terminal: cd frontend && npm start"
   echo ""
   echo "Or use Docker: docker-compose up -d"