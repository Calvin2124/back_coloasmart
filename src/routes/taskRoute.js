const express = require('express');
const taskControllerFactory = require('../controllers/taskController');

module.exports = (io) => {
    const router = express.Router();
    const taskController = taskControllerFactory(io);

    router.post('/create/', taskController.createTask);
    router.post('/list/', taskController.getTasks);

    return router;
};