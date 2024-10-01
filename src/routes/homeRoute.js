const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.post('/connected', homeController.connected);

module.exports = router;