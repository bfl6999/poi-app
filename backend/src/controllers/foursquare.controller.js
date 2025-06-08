const { fetchPOIsFromFoursquare } = require('../services/foursquare.service');
const POI = require('../models/poi.model');

exports.loadFromFoursquare = async (req, res) => {
  try {
    const query = req.query.query || 'museum';     // parámetro opcional en URL
    const near = req.query.near || 'Barcelona';    // parámetro opcional en URL

    const poisData = await fetchPOIsFromFoursquare(query, near);  // llamada al servicio

    const pois = poisData.map(poi => ({
      name: poi.name,
      location: poi.location?.locality || poi.location?.formatted_address || 'Unknown',
      latitude: poi.geocodes?.main?.latitude,
      longitude: poi.geocodes?.main?.longitude,
      dateAdded: new Date(),
    }));

    const inserted = await POI.insertMany(pois); // inserta en MongoDB
    res.json({ inserted: inserted.length, pois: inserted });
  } catch (error) {
    console.error('[loadFromFoursquare]', error.message);
    res.status(500).json({ error: 'Error loading POIs from Foursquare' });
  }
};