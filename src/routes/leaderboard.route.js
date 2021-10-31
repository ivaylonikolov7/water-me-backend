const express = require('express');
const router = express.Router();
const leaderboard = require('../controllers/ldr.controller');

router.get('/', leaderboard.index);

module.exports = router;