const { fetchPOIsFromFoursquare } = require('../services/foursquare.service');
const POI = require('../models/poi.model');
const axios = require('axios');

const headers = {
  Authorization: process.env.FOURSQUARE_API_KEY
};
async function getPlaceDetails(fsq_id) {
  const { data } = await axios.get(`https://api.foursquare.com/v3/places/${fsq_id}`, { headers });
  return data;
}

async function getPlacePhoto(fsq_id) {
  const { data } = await axios.get(`https://api.foursquare.com/v3/places/${fsq_id}/photos`, { headers });
  if (data.length > 0) {
    const photo = data[0];
    return `${photo.prefix}original${photo.suffix}`;
  }
  return null;
}

exports.loadFromFoursquare = async (req, res) => {
  try {
    const query = req.query.query || 'museum';     // parámetro opcional en URL
    const near = req.query.near || 'Barcelona';    // parámetro opcional en URL

    const poisData = await fetchPOIsFromFoursquare(query, near);  // llamada al servicio

    const enrichedPOIs = [];

    for (const poi of poisData) {
      try {
        const fsq_id = poi.fsq_id;
        const details = await getPlaceDetails(fsq_id);
        const imageUrl = await getPlacePhoto(fsq_id);

        const enriched = new POI({
          name: details.name,
          location: details.location?.formatted_address || 'Unknown',
          dateAdded: new Date(),
          imageUrl,
          source: 'foursquare',
          coordinates: {
            lat: details.geocodes?.main?.latitude,
            lng: details.geocodes?.main?.longitude,
          },
          geo: {
            type: 'Point',
            coordinates: [
              details.geocodes?.main?.longitude,
              details.geocodes?.main?.latitude,
            ],
          },
          // Si quieres añadir más campos:
          rating: details.rating || null,
          // hours, categories, etc. pueden agregarse también website: details.website || null,
        });

        await enriched.save();
        enrichedPOIs.push(enriched);
      } catch (innerError) {
        console.error('Error procesando fsq_id:', poi.fsq_id, innerError.message);
      }
    }

    res.json({ inserted: enrichedPOIs.length, pois: enrichedPOIs });
  } catch (error) {
    console.error('[loadFromFoursquare]', error.message);
    res.status(500).json({ error: 'Error loading POIs from Foursquare' });
  }
};