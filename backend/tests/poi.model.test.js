const POI = require('../src/models/poi.model');

describe('POI model schema', () => {
  it('crea una instancia de POI válida con mínimos campos', () => {
    const poi = new POI({
      name: 'Test POI',
      location: 'Test City',
      insertedBy: 'testUser123'
    });

    expect(poi.name).toBe('Test POI');
    expect(poi.location).toBe('Test City');
    expect(poi.insertedBy).toBe('testUser123');
    expect(Array.isArray(poi.comments)).toBe(true);
  });

  it('acepta la propiedad geo con tipo Point', () => {
    const poi = new POI({
      name: 'Test POI',
      location: 'Test City',
      insertedBy: 'testUser123',
      geo: {
        type: 'Point',
        coordinates: [-3.7038, 40.4168]
      }
    });

    expect(poi.geo.type).toBe('Point');
    expect(poi.geo.coordinates).toEqual([-3.7038, 40.4168]);
  });
});