var express = require('express');
var router = express.Router();

// Require controller modules.
var game_controller = require('../controllers/gameController');

// GET home page
router.get('/', game_controller.index);

module.exports = router;
