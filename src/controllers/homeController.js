const { User, Group, UserGroup } = require('../models');

exports.connected = async (req, res, next) => {
    try {
        // Trouver l'utilisateur et inclure les groupes associés
        /**
         * Retrieves the user information along with their associated group information.
         * @typedef {Object} UserWithGroup
         * @property {number} id - The user's ID.
         * @property {string} name - The user's name.
         * @property {boolean} isAdmin - Indicates if the user is an admin of the group.
         */

        /**
         * Retrieves the user information along with their associated group information.
         * @param {Object} req - The request object.
         * @param {Object} req.user - The user object.
         * @param {number} req.user.id - The user's ID.
         * @returns {Promise<UserWithGroup>} The user information along with their associated group information.
         */
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Group,
                through: { attributes: ['isAdmin'] }, // Inclure les infos de la table pivot UserGroup
                attributes: ['id', 'name'], // Inclure uniquement 'id' et 'name' du modèle Group
            }
        });

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mapper les groupes associés à l'utilisateur
        const groups = user.Groups.map(group => ({
            id: group.id,
            name: group.name,
            isAdmin: group.UserGroup.isAdmin
        }));

        // Envoyer la réponse JSON
        return res.status(200).json(groups); // Ajout de 'return' pour s'assurer que la fonction s'arrête ici
    } catch (error) {
        // Gérer les erreurs et envoyer une réponse d'erreur
        return res.status(500).json({ message: "Erreur lors de la récupération des groupes de l'utilisateur", error: error.message });
    }
};

exports.isConnected = async (req, res, next) => {
    // retourner true si l'utilisateur est connecté, false sinon
    return res.status(200).json({ isConnected: true }); 
};