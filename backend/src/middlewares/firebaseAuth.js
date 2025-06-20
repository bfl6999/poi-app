const admin = require('firebase-admin');
require('dotenv').config();

const path = require('path');

if (process.env.NODE_ENV !== 'testsuite') {
  if (!admin.apps.length) {
    const resolvedPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const serviceAccount = require(resolvedPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'Falta token de autenticación' });

  if (process.env.NODE_ENV === 'testsuite') {
    req.user = { uid: 'testUser123' };
    return next();
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Robust fallback: asignar uid desde varias fuentes posibles
    req.user = {
      uid: decoded.uid || decoded.user_id || decoded.sub
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};