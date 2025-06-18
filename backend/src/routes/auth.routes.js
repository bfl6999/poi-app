const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middlewares/firebaseAuth');

router.get('/me', firebaseAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;