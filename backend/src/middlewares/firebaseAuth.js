const admin = require('firebase-admin');
require('dotenv').config();

// Solo inicializar si no está ya inicializado (para Jest + hot reload)
if (!admin.apps.length) {
  const serviceAccount = require('c:/projects/secretFire/firebase-adminsdk.json');

  admin.initializeApp({ // Inicializa Firebase Admin con tu clave privada
    credential: admin.credential.cert(serviceAccount)
  });
}
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'Falta token de autenticación' });
  // 🧪 Bypass en entorno de test
  if (process.env.NODE_ENV === 'testsuite') {
    req.user = { uid: 'testUser123' }; // UID falso para pruebas
    return next();
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // puedes usar req.user.uid si necesitas el ID del usuario
    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    return res.status(401).json({ error: 'Token inválido' });
  }
};
