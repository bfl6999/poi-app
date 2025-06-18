const { fetchPOIsFromFoursquare } = require('../src/services/foursquare.service');
const axios = require('axios');

jest.mock('axios');

describe('fetchPOIsFromFoursquare', () => {
  afterEach(() => jest.clearAllMocks());

  it('devuelve un array de resultados cuando la API responde 200', async () => {
    /* simula respuesta de Foursquare */
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { fsq_id: 'abc', name: 'Cafe Foo' },
          { fsq_id: 'def', name: 'Bar Baz' }
        ]
      }
    });

    const pois = await fetchPOIsFromFoursquare('coffee', 'Madrid');

    /* comprueba URL base y headers */
    expect(axios.get.mock.calls[0][0]).toBe('https://api.foursquare.com/v3/places/search');
    expect(axios.get.mock.calls[0][1].headers.Authorization).toBe(process.env.FOURSQUARE_API_KEY);

    expect(pois).toHaveLength(2);
    expect(pois[0]).toHaveProperty('name', 'Cafe Foo');
  });

  it('propaga el error si axios falla', async () => {
    axios.get.mockRejectedValueOnce(new Error('FSQ down'));

    await expect(fetchPOIsFromFoursquare('x', 'y')).rejects.toThrow('FSQ down');
  });
});