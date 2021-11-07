const express = require('express');
const router = express.Router();
const plant = require('../controllers/plant.controller');

router.get('/water', plant.index);

module.exports = router;