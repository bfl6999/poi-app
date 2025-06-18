const errorHandler = require('../src/middlewares/errorHandler');

test('devuelve 500 con mensaje si error tiene message', () => {
  const err = new Error('Fallo');
  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  errorHandler(err, req, res, () => {});
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Fallo' });
});