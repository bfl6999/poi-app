const axios = require('axios');

exports.fetchPOIsFromFoursquare = async (query, near) => {
  const url = 'https://api.foursquare.com/v3/places/search';

  const response = await axios.get(url, {
    headers: {
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
    params: {
      query,
      near,
      limit: 10,  // Se puede ajustas o parametrizar
    },
  });

  return response.data.results;
};