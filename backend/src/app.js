const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const poiRoutes = require('./routes/poi.routes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/pois', poiRoutes);

module.exports = app;