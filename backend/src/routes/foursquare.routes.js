const express = require('express');
const axios = require('axios');
const router = express.Router();
const firebaseAuth = require('../middlewares/firebaseAuth');

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

/**
 * @swagger
 * /pois:
 *   get:
 *     summary: Realizar una busqueda en la Api de Foursquare Search
 *     responses:
 *       200:
 *         description: Lista de POIs
 */

router.get('/search', firebaseAuth, async (req, res) => {
  const { query, near } = req.query;

  try {
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      headers: {
        Authorization: FOURSQUARE_API_KEY
      },
      params: {
        query,
        near,
        limit: 20
      }
    });

    const results = response.data.results.map(place => ({
      fsq_id: place.fsq_id,
      name: place.name,
      location: place.location.formatted_address,
      latitude: place.geocodes?.main?.latitude,
      longitude: place.geocodes?.main?.longitude
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error buscando en Foursquare' });
  }
});

module.exports = router;