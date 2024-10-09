const express = require('express');
const router = express.Router();
/**
 * Controller for handling group-related operations.
 * @type {import('../controllers/groupController')}
 */
const groupController = require('../controllers/groupController');

router.post('/create', groupController.createGroup);
router.post('/join', groupController.joinGroup);
router.post('/leave', groupController.leaveGroup);
router.post('/list', groupController.getUserGroups);
router.post('/:groupId', groupController.getGroupMember);


module.exports = router;