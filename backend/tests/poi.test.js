const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();
const mongoose = require('mongoose');

const TEST_TOKEN = process.env.TEST_JWT;
let createdPoiId = '';
let createdCommentId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API POIs', () => {
  // 1. GET /pois
  it('GET /api/pois → lista todos los POIs', async () => {
    const res = await request(app).get('/api/pois');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. POST /pois
  it('POST /api/pois → crea un nuevo POI (token requerido)', async () => {
    const newPoi = {
      name: 'Test POI',
      location: 'Ciudad Test',
      description: 'Descripción de prueba',
      imageUrl: '',
      coordinates: { lat: 40.4168, lng: -3.7038 },
      geo: { type: 'Point', coordinates: [-3.7038, 40.4168] },
    };

    const res = await request(app)
      .post('/api/pois')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send(newPoi);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdPoiId = res.body._id;
  });

  // 3. GET /pois/:id
  it('GET /api/pois/:id → obtiene un POI específico', async () => {
    const res = await request(app).get(`/api/pois/${createdPoiId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
  });

  // 4. PUT /pois/:id
  it('PUT /api/pois/:id → actualiza un POI (token requerido)', async () => {
    const res = await request(app)
      .put(`/api/pois/${createdPoiId}`)
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({ name: 'Test POI Editado', geo: { 
        type: 'Point',
        coordinates: [-3.7038, 40.4168] // Ejemplo: Madrid
  } });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test POI Editado');
  });

  // 5. POST /pois/:id/comments
  it('POST /api/pois/:id/comments → añade un comentario', async () => {
    const comment = {
      author: 'Tester',
      comment: 'Comentario automático',
      stars: 5,
      location: 'Madrid',
      userUid: 'testUser123'
    };

    const res = await request(app)
      .post(`/api/pois/${createdPoiId}/comments`)
      .send(comment);

    expect(res.statusCode).toBe(201);
    createdCommentId = res.body.comments?.slice(-1)[0]?._id || '';
  });

  // 6. DELETE /pois/:id/comments/:commentId
  it('DELETE /api/pois/:id/comments/:commentId → borra un comentario (token requerido)', async () => {
    if (!createdCommentId) return;

    const res = await request(app)
      .delete(`/api/pois/${createdPoiId}/comments/${createdCommentId}`)
      .set('Authorization', `Bearer ${TEST_TOKEN}`);

    expect([200, 403]).toContain(res.statusCode);
  });

  // 7. GET /pois/user/:id
  it('GET /api/pois/user/:id → devuelve los POIs del usuario (token requerido)', async () => {
    const userId = 'testUser123'; // Usa el UID real del token
    const res = await request(app)
      .get(`/api/pois/user/${userId}`)
      .set('Authorization', `Bearer ${TEST_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 8. POST /pois/import-foursquare
  it('POST /api/pois/import-foursquare → inserta varios POIs por fsqIds (token requerido)', async () => {
    const fsqIds = ['68507d159f9f4ea6e6c0ee83']; // ID real de test opcional

    const res = await request(app)
      .post('/api/pois/import-foursquare')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({ fsqIds });

    expect([201, 500]).toContain(res.statusCode);
  });

  // 9. POST /pois/generate-route
  it('POST /api/pois/generate-route → genera una ruta (token requerido)', async () => {
    const res = await request(app)
      .post('/api/pois/generate-route')
      .set('Authorization', `Bearer ${TEST_TOKEN}`)
      .send({ city: 'Madrid' });

    expect([200, 404, 500]).toContain(res.statusCode);
  });

  // 10. DELETE /pois/:id
  it('DELETE /api/pois/:id → elimina el POI creado (token requerido)', async () => {
    const res = await request(app)
      .delete(`/api/pois/${createdPoiId}`)
      .set('Authorization', `Bearer ${TEST_TOKEN}`);

    expect([200, 403]).toContain(res.statusCode);
  });
});