module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POI API',
      version: '1.0.0',
      description: 'API REST para la gestión de POIs',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
    // no 'security' aquí, solo en endpoints específicos
  },
  apis: ['./src/routes/*.js'],
};