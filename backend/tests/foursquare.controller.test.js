/**
 * Tests unitarios del controlador loadFromFoursquare
 *  – Cubre happy-path y error-path
 */
const { loadFromFoursquare } = require('../src/controllers/foursquare.controller');
const POI = require('../src/models/poi.model');
const axios = require('axios');

jest.mock('axios');
jest.mock('../src/models/poi.model');

/* Silenciar console.error en este test */
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Foursquare Controller', () => {
  it('inserta 1 POI devuelto por Foursquare', async () => {
    /* ❶ búsqueda */
    axios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            results: [
              {
                fsq_id: 'abc123',
                name: 'Foo',
                location: { formatted_address: 'Bar' }
              }
            ]
          }
        })
      )
      /* ❷ detalles (podemos devolver sólo lo que usa el controlador) */
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: { categories: [{ name: 'Coffee' }] }
        })
      )
      /* ❸ fotos */
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            {
              id: 'p1',
              prefix: 'https://img/',
              suffix: '.jpg',
              width: 100,
              height: 100
            }
          ]
        })
      );

    POI.mockImplementation(() => ({ save: jest.fn() }));

    const req = { query: { query: 'test', near: 'Madrid' } };
    const json = jest.fn();
    const res = { json, status: jest.fn().mockReturnThis() };

    await loadFromFoursquare(req, res);

    expect(axios.get).toHaveBeenCalledTimes(3);           // ✅ tres llamadas
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ inserted: 1, pois: expect.any(Array) })
    );
  });

  it('propaga error externo y responde 500', async () => {
    axios.get.mockRejectedValue(new Error('Foursquare down'));
    POI.mockImplementation(() => ({}));

    const req = { query: { query: 'fail', near: 'Nowhere' } };
    const status = jest.fn().mockReturnThis();
    const res = { json: jest.fn(), status };

    await loadFromFoursquare(req, res);

    expect(status).toHaveBeenCalledWith(500);
  });
});