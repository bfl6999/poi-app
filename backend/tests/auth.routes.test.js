const request = require('supertest');
const app = require('../src/app');

describe('GET /api/auth/me', () => {
  it('debería devolver 401 sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Falta token de autenticación');
  });

  it('debería permitir el acceso si NODE_ENV=testsuite', async () => {
    process.env.NODE_ENV = 'testsuite';
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer fake-token');
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual({ uid: 'testUser123' });
  });
});