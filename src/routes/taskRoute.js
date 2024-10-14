const express = require('express');
const router = express.Router();
/**
 * Controller for handling home-related functionality.
 * @type {Object}
 */
const taskController = require('../controllers/taskController');

router.post('/create/', taskController.createTask);

module.exports = router;
