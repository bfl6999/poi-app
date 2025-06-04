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
  },
  apis: ['./routes/*.js'],
};