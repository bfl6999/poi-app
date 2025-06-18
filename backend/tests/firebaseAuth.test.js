const mockVerifyIdToken = jest.fn();

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  auth: () => ({ verifyIdToken: mockVerifyIdToken })
}));

const firebaseAuth = require('../src/middlewares/firebaseAuth');

describe('firebaseAuth middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('permite pasar si NODE_ENV=testsuite (bypass)', async () => {
    process.env.NODE_ENV = 'testsuite';

    /* ← token dummy para no activar el 401 inicial */
    const req = { headers: { authorization: 'Bearer dummy' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await firebaseAuth(req, res, next);

    expect(req.user).toEqual({ uid: 'testUser123' });
    expect(next).toHaveBeenCalled();
  });

  it('rechaza si falta el token', async () => {
    process.env.NODE_ENV = 'production';

    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await firebaseAuth(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('pasa si el token es válido (producción)', async () => {
    process.env.NODE_ENV = 'production';
    mockVerifyIdToken.mockResolvedValueOnce({ uid: 'realUser' });

    const req = { headers: { authorization: 'Bearer valid' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await firebaseAuth(req, res, next);

    expect(req.user.uid).toBe('realUser');
    expect(next).toHaveBeenCalled();
  });
});