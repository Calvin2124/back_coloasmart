const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/create', groupController.createGroup);
router.post('/join', groupController.joinGroup);
router.post('/leave', groupController.leaveGroup);
router.get('/user/:userId', groupController.getUserGroups);

module.exports = router;