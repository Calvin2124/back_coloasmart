// taskController.js
const Task = require('../models/Task'); // Assurez-vous d'importer votre modèle de tâche

module.exports = (io) => {
    return {
        createTask: async (req, res) => {
            try {
                const { tagColor, taskText, dueDate, idUser, groupId } = req.body;

                // Créez la nouvelle tâche dans votre base de données
                const newTask = await Task.create({ tagColor, taskText, dueDate, idUser, groupId });

                // Émettez l'événement `newTask` avec la nouvelle tâche à tous les clients dans le groupe
                io.to(groupId).emit('newTask', newTask);

                res.status(201).json(newTask);
            } catch (error) {
                console.error("Error creating task:", error);
                res.status(500).send("Erreur lors de la création de la tâche.");
            }
        },

        getTasks: async (req, res) => {
            try {
                const { idUser, groupId } = req.body;
                // Récupérez les tâches pour l'utilisateur et le groupe spécifiés
                const tasks = await Task.findAll({ where: { groupId } });
                res.json(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                res.status(500).send("Erreur lors de la récupération des tâches.");
            }
        }
    };
};