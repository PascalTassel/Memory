var express = require('express');
var router = express.Router();

// Require controller modules.
var datas_controller = require('../controllers/datasController');

// GET scores
router.get('/', datas_controller.get_scores);

// SET score
router.post('/', datas_controller.set_score);

// Get rank
router.get('/rank/:score', datas_controller.get_rank);

module.exports = router;
