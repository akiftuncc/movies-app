# Cinema API

## Description

A REST API for a cinema.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- Yarn package manager
- MySQL (v8 or higher)
- Protobuf compiler
- Prisma CLI

## Installation & Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:5432/database_name"

# Application
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Add any other necessary environment variables
```

### 3. Database Setup

Run the following commands to set up your database:

```bash
# Run database migrations
yarn prisma migrate dev

# Seed the database with initial data
yarn prisma:db:seed
```

### 4. Start the Application

```bash
# Development mode with hot-reload
yarn start:dev

# Production mode
yarn start:prod
```

#### Swagger `http://localhost:3000/api`

## Available Scripts

```bash
# Development
yarn start:dev         # Start the application in development mode
yarn start:debug      # Start with debugging enabled

# Database
yarn prisma:studio    # Open Prisma Studio
yarn prisma:migrate   # Run database migrations
yarn prisma:db:seed   # Seed the database

# Testing
yarn test            # Run unit tests
yarn test:e2e        # Run end-to-end tests
yarn test:cov        # Generate test coverage report

# Production
yarn build           # Build the application
yarn start:prod      # Start in production mode
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── dto/           # Data Transfer Objects
├── entities/      # Database entities
├── middleware/    # Custom middleware
├── modules/       # Feature modules
├── services/      # Business logic
└── main.ts        # Application entry point
```

## Deployment

Follow these steps to deploy the application:

1. Build the application

```bash
yarn build
```

2. Set up production environment variables
3. Run database migrations
4. Start the application

```bash
yarn start:prod
```
