const express = require('express');
const router = express.Router();
/**
 * Controller for handling authentication related operations.
 * @type {Object}
 */
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;