const express = require('express');
const router = express.Router();

const firebaseAuth = require('../../middleware/firebaseAuth');
const POI = require('../../models/POI');

// POST /api/pois/import
router.post('/import', firebaseAuth, async (req, res) => {
  const poi = new POI({
    name: req.body.name,
    location: req.body.location,
    imageUrl: req.body.imageUrl,
    geo: req.body.geo,
    source: 'foursquare',
    dateAdded: new Date()
  });

  await poi.save();
  res.status(201).json(poi);
});