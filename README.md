# Lecture Management System

A Node.js-based API for managing lectures, users, and authentication with Redis caching.

## Features

- **User Management**: Register, login, and manage user profiles
- **Lecture Management**: Create, read, update, and delete lectures
- **Authentication**: JWT-based authentication with role-based access control
- **Redis Caching**: Fast data access with Redis caching
- **Swagger Documentation**: Interactive API documentation
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- Docker and Docker Compose (optional)

## Installation

### Local Setup

1. Clone the repository:
   ```
   git clone git@github.com:ghGill/lecture-managment.git
   cd lecture-management
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017
   REDISDB_URI=redis://localhost:6379
   JWT_SECRET_KEY=your_secret_key
   ```

4. Start the application:
   ```
   npm start
   ```

### Docker Setup

1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. The application will be available at http://localhost:3000

## API Documentation

The API documentation is available at `/api-docs` when the application is running. It provides:

- Interactive API testing
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Lectures
- `GET /lecture` - Get all lectures
- `GET /lecture/:id` - Get lecture by ID
- `POST /lecture` - Create a new lecture
- `PUT /lecture/:id` - Update lecture
- `DELETE /lecture/:id` - Delete lecture

### Redis Operations
- `GET /redis/put/:key/:val` - Store a key-value pair
- `GET /redis/get/:key` - Retrieve a value by key
- `GET /redis/exist/:key` - Check if a key exists
- `GET /redis/keys` - Get all keys
- `GET /redis/clear` - Clear all keys

## Health Check

The application provides a health check endpoint at `/_/health_check` to verify that all services (MongoDB and Redis) are running correctly.

## Development

### Running Tests
```
npm test
```

### Linting
```
npm run lint
```

## License

[MIT](LICENSE) 