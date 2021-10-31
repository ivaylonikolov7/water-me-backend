const express = require('express');
const router = express.Router();
const progression = require('../controllers/progression.controller');

router.get('/', progression.index);

module.exports = router;