const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const poiRoutes = require('./routes/poi.routes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./docs/swaggerOptions');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/pois', poiRoutes);

// Conexión Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

module.exports = app;