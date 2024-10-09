const express = require('express');
const router = express.Router();
/**
 * Controller for handling default tag operations.
 * @type {import('../controllers/defaultTagController')}
 */
const defaultTagController = require('../controllers/defaultTagController');

router.get('/defaultTags', defaultTagController.getDefaultTags);

module.exports = router;