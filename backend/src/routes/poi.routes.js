const express = require('express');
const router = express.Router();
const POI = require('../models/poi.model');

// GET all POIs
router.get('/', async (req, res) => {
  const { name, location, date } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, 'i');
  if (location) filter.location = new RegExp(location, 'i');
  if (date) filter.dateAdded = { $gte: new Date(date) };

  const pois = await POI.find(filter);
  res.json(pois);
});

// GET by ID
router.get('/:id', async (req, res) => {
  const poi = await POI.findById(req.params.id);
  if (!poi) return res.status(404).json({ message: 'POI not found' });
  res.json(poi);
});

// POST new POI
router.post('/', async (req, res) => {
  const poi = new POI(req.body);
  await poi.save();
  res.status(201).json(poi);
});

module.exports = router;