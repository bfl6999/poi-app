const express = require('express');
const router = express.Router();
const POI = require('../models/poi.model');
const auth = require('../middlewares/firebaseAuth'); // middleware para usuarios que se registran
const { loadFromFoursquare } = require('../controllers/foursquare.controller');


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
 * /pois:
 *   get:
 *     summary: Obtener un POI con el ID pasado por parametro
 *     responses:
 *       200:
 *         description: POI que se busca
 *       400:
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
 *     summary: Crear un nuevo POI (requiere token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: POI creado
 */

router.post('/', auth, async (req, res) => {
  try {
    const body = {
      ...req.body,
      insertedBy: req.user.uid  // 🔒 garantizado por el middleware auth
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
 * /pois:
 *   post:
 *     summary: Crear un nuevo comentario a un POI (requiere token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: comentario en POI creado
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
 * /pois/{poiId}/comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario de un POI (requiere token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: poiId
 *         required: true
 *       - in: path
 *         name: commentId
 *         required: true
 *     responses:
 *       200:
 *         description: Comentario eliminado
 */

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
 * /pois:
 *   post:
 *     summary: Eliminar un POI (requiere token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: POI eliminado
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
 *     summary: Actualizar un POI (requiere token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del POI a actualizar
 *     responses:
 *       200:
 *         description: POI actualizado
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

module.exports = router;