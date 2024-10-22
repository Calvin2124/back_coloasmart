const Task = require('../models/Task');
const { Op } = require('sequelize');

module.exports = (io) => {
    return {
        createTask: async (req, res) => {
            try {
                const { tagColor, taskText, dueDate, idUser, groupId } = req.body;

                // Validation des données
                if (!taskText || !dueDate || !groupId) {
                    return res.status(400).json({
                        error: "Tous les champs obligatoires doivent être remplis."
                    });
                }

                // Créez la nouvelle tâche dans la base de données
                const newTask = await Task.create({
                    tagColor,
                    taskText,
                    dueDate,
                    idUser,
                    groupId,
                    completed: false
                });

                // Émettez l'événement `newTask` avec la nouvelle tâche
                io.to(groupId).emit('newTask', newTask);

                res.status(201).json(newTask);
            } catch (error) {
                console.error("Error creating task:", error);
                res.status(500).json({
                    error: "Erreur lors de la création de la tâche.",
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        },

        getTasks: async (req, res) => {
            try {
                const { idUser, groupId, date } = req.body;

                // Validation du groupId
                if (!groupId) {
                    return res.status(400).json({
                        error: "L'ID du groupe est requis"
                    });
                }

                let whereCondition = { groupId };

                // Si une date est fournie, ajoutez le filtre de date
                if (date) {
                    const queryDate = new Date(date);
                    
                    // Vérifie si la date est valide
                    if (isNaN(queryDate.getTime())) {
                        return res.status(400).json({
                            error: "Format de date invalide"
                        });
                    }

                    whereCondition.dueDate = {
                        [Op.between]: [
                            new Date(queryDate.setHours(0, 0, 0, 0)),
                            new Date(queryDate.setHours(23, 59, 59, 999))
                        ]
                    };
                }

                // Récupérez les tâches avec les conditions
                const tasks = await Task.findAll({
                    where: whereCondition,
                    order: [['createdAt', 'DESC']],
                    attributes: [
                        'id',
                        'taskText',
                        'tagColor',
                        'dueDate',
                        'completed',
                        'idUser',
                        'groupId',
                        'createdAt'
                    ]
                });

                res.json(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                res.status(500).json({
                    error: "Erreur lors de la récupération des tâches.",
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        },

        updateTaskStatus: async (req, res) => {
            try {
                const { taskId, completed, groupId } = req.body;

                const task = await Task.findByPk(taskId);
                if (!task) {
                    return res.status(404).json({
                        error: "Tâche non trouvée"
                    });
                }

                // Mise à jour du statut
                await task.update({ completed });

                // Émission d'un événement pour la mise à jour
                io.to(groupId).emit('taskUpdated', {
                    taskId,
                    completed
                });

                res.json({ success: true });
            } catch (error) {
                console.error("Error updating task status:", error);
                res.status(500).json({
                    error: "Erreur lors de la mise à jour du statut de la tâche.",
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        }
    };
};