const express = require('express');
const router = express.Router();
const defaultTagController = require('../controllers/defaultTagController');

router.get('/defaultTags', defaultTagController.getDefaultTags);

module.exports = router;