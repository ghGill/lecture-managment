const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lecture Management System API',
      version: '1.0.0',
      description: 'API documentation for the Lecture Management System with User Management',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Lectures',
        description: 'Lecture management endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
    components: {
      schemas: {
        Lecture: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the lecture',
            },
            subject: {
              type: 'string',
              description: 'Subject of the lecture',
            },
            title: {
              type: 'string',
              description: 'Title of the lecture',
            },
            description: {
              type: 'string',
              description: 'Description of the lecture',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
            },
            role: {
              type: 'string',
              description: 'Role of the user',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);
module.exports = specs; 