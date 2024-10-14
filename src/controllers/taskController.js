const { Task, User, Group } = require('../models');

module.exports = (io) => {
    return {
        createTask: async (req, res) => {
            try {
                const { tagColor, taskText, dueDate, idUser, groupId } = req.body;

                // Validation des données
                if (!tagColor || !taskText || !dueDate || !idUser || !groupId) {
                    return res.status(400).json({ message: "Tous les champs sont requis" });
                }

                // Vérification de l'existence de l'utilisateur et du groupe
                const user = await User.findByPk(idUser);
                const group = await Group.findByPk(groupId);

                if (!user || !group) {
                    return res.status(404).json({ message: "Utilisateur ou groupe non trouvé" });
                }

                const task = await Task.create({ tagColor, taskText, dueDate, idUser, groupId });
                
                // Émettre un événement à tous les clients connectés dans le groupe
                io.to(groupId).emit('newTask', task);

                res.status(201).json(task);
            } catch (err) {
                console.error("Error occurred during task creation: ", err);
                if (err.name === 'SequelizeValidationError') {
                    return res.status(400).json({ message: "Données invalides", errors: err.errors });
                }
                return res.status(500).json({ message: "Erreur interne du serveur" });
            }
        },

        getTasks: async (req, res) => {
            try {
                const { idUser, groupId } = req.body;

                // Validation des données
                if (!idUser || !groupId) {
                    return res.status(400).json({ message: "Tous les champs sont requis" });
                }

                // Vérification de l'existence de l'utilisateur et du groupe
                const user = await User.findByPk(idUser);
                const group = await Group.findByPk(groupId);

                if (!user || !group) {
                    return res.status(404).json({ message: "Utilisateur ou groupe non trouvé" });
                }

                const tasks = await Task.findAll({ where: { groupId } });
                res.status(200).json(tasks);
            } catch (err) {
                console.error("Error occurred while fetching tasks: ", err);
                return res.status(500).json({ message: "Erreur interne du serveur" });
            }
        }
    };
};