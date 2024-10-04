const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.post('/connected', homeController.connected);
router.post('/isConnected', homeController.isConnected);

module.exports = router;