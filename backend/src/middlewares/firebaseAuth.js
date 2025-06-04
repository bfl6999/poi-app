const admin = require('firebase-admin');

// Inicializa Firebase Admin con tu clave privada
const serviceAccount = require('../firebase-adminsdk.json'); // Ruta al archivo descargado desde Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'Falta token de autenticación' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // puedes usar req.user.uid si necesitas el ID del usuario
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
