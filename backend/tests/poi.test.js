const request = require('supertest');
const app = require('../src/app');

describe('GET /api/pois', () => {
  it('Debería devolver 200 OK', async () => {
    const res = await request(app).get('/api/pois');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
