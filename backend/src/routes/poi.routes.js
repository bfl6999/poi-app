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
  const poi = new POI(req.body);
  await poi.save();
  res.status(201).json(poi);
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
    const { author, comment, stars } = req.body;
    const poi = await POI.findById(req.params.id);
    poi.comments.push({ author, comment, stars });
    await poi.save();
    res.status(201).json(poi);
  } catch (err) {
    res.status(500).json({ error: 'Error al añadir comentario' });
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
    await POI.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar POI' });
  }
});

module.exports = router;