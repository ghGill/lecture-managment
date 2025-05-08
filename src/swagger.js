const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
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
            password: {
              type: 'string',
              description: 'User password (only for registration/login)',
            },
          },
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Lectures',
        description: 'Lecture management endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Authentications',
        description: 'Authentication management endpoints',
      },
      {
        name: 'Redis',
        description: 'Redis operations endpoints',
      },
      {
        name: 'Postgres',
        description: 'Postgres operations endpoints',
      },
      {
        name: 'Sequelize - Entities CRUD',
        description: 'CRUD for Lecture or Student operations endpoints',
      },
      {
        name: 'Sequelize - Session',
        description: 'Sessions operations endpoints',
      },
      {
        name: 'Sequelize - Registraion',
        description: 'Registration operations endpoints',
      },
      {
        name: 'Sequelize - Advanced',
        description: 'Advanced operations endpoints',
      },
      {
        name: 'Axios',
        description: 'Axios api endpoints',
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')], // Use absolute path to route files
};

const specs = swaggerJsdoc(options);
module.exports = specs; 
