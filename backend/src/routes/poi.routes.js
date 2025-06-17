const express = require('express');
const router = express.Router();
const POI = require('../models/poi.model');
const auth = require('../middlewares/firebaseAuth'); // middleware para usuarios que se registran
const { loadFromFoursquare } = require('../controllers/foursquare.controller');

//const { ChatGroq } = require('groq-sdk'); // instala si no lo tienes
// const groq = new ChatGroq({ apiKey: process.env.GROQ_API_KEY }); 

let groq;
try {
  groq = require('../services/groqClient.service');
} catch (error) {
  console.warn('[WARN] Groq no disponible. Algunas rutas serán omitidas.');
  groq = null;
}
const axios = require('axios');

/**
 * @swagger
 * /pois:
 *   get:
 *     summary: Obtener todos los POIs
 *     responses:
 *       200:
 *         description: Lista de POIs
 */

router.get('/load-from-foursquare', loadFromFoursquare);

// GET all POIs

/**
 * @swagger
 * /pois:
 *   get:
 *     summary: Obtener todos los POIs
 *     tags: [POIs]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtrar por ubicación
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Filtrar desde una fecha (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de POIs
 */

router.get('/', async (req, res) => {
  const { name, location, date } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, 'i');
  if (location) filter.location = new RegExp(location, 'i');
  if (date) filter.dateAdded = { $gte: new Date(date) };

  const pois = await POI.find(filter);
  res.json(pois);
});

// GET by ID

/**
 * @swagger
 * /pois/{id}:
 *   get:
 *     summary: Obtener un POI por su ID
 *     tags: [POIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Encontrar POI por id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: POI encontrado
 *       404:
 *         description: POI no encontrado
 */

router.get('/:id', async (req, res) => {
  const poi = await POI.findById(req.params.id);
  if (!poi) return res.status(404).json({ message: 'POI not found' });
  res.json(poi);
});

// POST new POI

/**
 * @swagger
 * /pois:
 *   post:
 *     summary: Crear un nuevo POI
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               geo:
 *                 type: object
 *     responses:
 *       201:
 *         description: POI creado
 */


router.post('/', auth, async (req, res) => {
  try {
    const body = {
      ...req.body,
      insertedBy: req.user.uid
    };

    const poi = new POI(body);
    await poi.save();
    res.status(201).json(poi);
  } catch (err) {
    console.error('Error al crear POI:', err);
    res.status(500).json({ error: 'Error al crear POI' });
  }
});

/**
 * @swagger
 * /pois/{id}/comments:
 *   post:
 *     summary: Añadir un comentario a un POI
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *               comment:
 *                 type: string
 *               stars:
 *                 type: integer
 *               location:
 *                 type: string
 *               userUid:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario añadido
 */

// Añadir comentario a un POI
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, comment, stars, location, userUid } = req.body;

    // Validación mínima
    if (!author || !comment || stars === undefined || !location) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const poi = await POI.findById(req.params.id);
    if (!poi) return res.status(404).json({ message: 'POI no encontrado' });

    const newComment = {
      author,
      comment,
      userUid,
      stars,
      location,
      createdAt: new Date()
    };

    poi.comments.push(newComment);
    await poi.save();

    res.status(201).json({ message: 'Comentario añadido', comment: newComment });
  } catch (err) {
    res.status(500).json({ error: 'Error al añadir comentario' });
  }
});

/**
 * @swagger
 * /pois/{id}/comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario de un POI
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del POI
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado
 */

// Eliminar comentario a un POI

router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const poi = await POI.findById(req.params.id);
    if (!poi) return res.status(404).json({ message: 'POI no encontrado' });

    const comment = poi.comments.id(req.params.commentId);
    if (comment.userUid !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
    }

    comment.deleteOne();
    await poi.save();

    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    console.error('Error eliminando comentario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar POI

/**
 * @swagger
 * /pois/{id}:
 *   delete:
 *     summary: Eliminar un POI
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del POI a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: POI eliminado
 *       403:
 *         description: No autorizado
 */

router.delete('/:id', auth, async (req, res) => {
  try {
    const poi = await POI.findById(req.params.id);
    if (!poi) return res.status(404).json({ message: 'POI no encontrado' });

    if (poi.insertedBy !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado para eliminar este POI' });
    }

    await poi.deleteOne();
    res.json({ message: 'POI eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando POI:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

/**
 * @swagger
 * /pois/{id}:
 *   put:
 *     summary: Actualizar un POI
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del POI a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: POI actualizado
 *       403:
 *         description: No autorizado
 */

router.put('/:id', auth, async (req, res) => {
  try {
    const poi = await POI.findById(req.params.id);
    if (!poi) return res.status(404).json({ message: 'POI no encontrado' });

    if (poi.insertedBy !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado para editar este POI' });
    }
    poi.name = req.body.name;
    poi.location = req.body.location;
    poi.description = req.body.description;
    poi.imageUrl = req.body.imageUrl;
    poi.coordinates = req.body.coordinates;
    poi.geo = req.body.geo;
    console.log('Después:', poi);

    await poi.save();
    res.json(poi);
  } catch (err) {
    console.error('Error actualizando POI:', err);
    res.status(500).json({ message: 'Error al actualizar POI' });
  }
});

/**
 * @swagger
 * /pois/generate-route:
 *   post:
 *     summary: Generar una ruta turística personalizada
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ruta generada
 */

router.post('/generate-route', auth, async (req, res) => {

  if (!groq) {
    return res.status(503).json({ error: 'Groq API deshabilitada en entorno de test' });
  }

  try {
    const { city } = req.body;
    const userId = req.user.uid;

    if (!city) {
      return res.status(400).json({ error: 'Ciudad requerida' });
    }

    const pois = await POI.find({ insertedBy: userId, location: new RegExp(city, 'i') });

    if (!pois.length) {
      return res.status(404).json({ error: 'No se encontraron POIs para esa ciudad. Inserta alguno!' });
    }

    const prompt = `
Eres un guía turístico. Crea una ruta personalizada en ${city} usando los siguientes puntos de interés:

${pois.map(p => `- ${p.name}`).join('\n')}

Devuélvela en el siguiente formato JSON:

{
  "city": "${city}",
  "ruta": [
    {
      "hora": "09:00",
      "lugar": "Nombre del lugar",
      "descripcion": "Descripción breve"
    }
  ]
}

Solo responde con el JSON, sin texto adicional.
`;

    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'Eres un asistente experto en turismo' },
        { role: 'user', content: prompt }
      ]
    });

    const plan = response.choices?.[0]?.message?.content;

    res.json({ routePlan: plan || 'No se pudo generar una ruta' });

  } catch (err) {
    console.error('Error generando ruta:', err);
    res.status(500).json({ error: 'Error generando la ruta' });
  }
});



/**
 * @swagger
 * /pois/user/{id}:
 *   get:
 *     summary: Obtener POIs de un usuario especificado
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario
 *     responses:
 *       200:
 *         description: Lista de POIs del usuario
 */


router.get('/user/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Verifica si el usuario autenticado es el mismo que se consulta
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    const userPois = await POI.find({ insertedBy: userId }).sort({ dateAdded: -1 });

    res.json(userPois);
  } catch (error) {
    console.error('Error obteniendo POIs del usuario:', error);
    res.status(500).json({ error: 'Error obteniendo POIs del usuario' });
  }
});

/**
 * @swagger
 * /pois/import-foursquare:
 *   post:
 *     summary: Insertar múltiples POIs desde Foursquare
 *     tags: [Foursquare]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fsqIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: POIs insertados
 */

router.post('/import-foursquare', auth, async (req, res) => {
  const { fsqIds } = req.body;
  if (!Array.isArray(fsqIds)) {
    return res.status(400).json({ error: 'Debes proporcionar un array de fsqIds' });
  }

  try {
    const results = [];

    for (const fsq_id of fsqIds) {
      const detailRes = await axios.get(`https://api.foursquare.com/v3/places/${fsq_id}`, {
        headers: {
          Authorization: process.env.FOURSQUARE_API_KEY
        }
      });

      const place = detailRes.data;

      const poiLat = place.geocodes?.main?.latitude;
      const poiLng = place.geocodes?.main?.longitude;

      const photo = place.photos?.[0];
      const categoryIcon = place.categories?.[0]?.icon;

      const imageUrl = photo
        ? `${photo.prefix}original${photo.suffix}`
        : categoryIcon
          ? `${categoryIcon.prefix}64${categoryIcon.suffix}`
          : '';

      const newPoi = new POI({
        name: place.name,
        description: place.description || '',
        location: place.location?.formatted_address || '',
        coordinates: {
          lat: poiLat,
          lng: poiLng
        },
        geo: {
          type: 'Point',
          coordinates: [poiLng, poiLat]
        },
        imageUrl,
        source: 'foursquare',
        insertedBy: req.user.uid,
        dateAdded: new Date().toISOString()
      });

      await newPoi.save();
      results.push(newPoi);
    }

    res.status(201).json(results);
  } catch (err) {
    console.error('Error importando desde Foursquare:', err);
    res.status(500).json({ error: 'Error importando POIs desde Foursquare' });
  }
});

module.exports = router;