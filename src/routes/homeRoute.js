const express = require('express');
const router = express.Router();
/**
 * Controller for handling home-related functionality.
 * @type {Object}
 */
const homeController = require('../controllers/homeController');

router.post('/connected', homeController.connected);
router.post('/isConnected', homeController.isConnected);

module.exports = router;