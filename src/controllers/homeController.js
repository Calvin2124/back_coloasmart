const { User, Group, UserGroup } = require('../models');

/**
 * Retrieves the groups associated with the currently connected user, including their admin status.
 * 
 * @async
 * @function connected
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The authenticated user object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Sends an HTTP response with the list of groups the user is associated with.
 * 
 * @throws {Error} - Throws errors for user not found or database issues.
 */
exports.connected = async (req, res, next) => {
    try {
        // Trouver l'utilisateur et inclure les groupes associés
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

/**
 * Checks if the user is connected and returns the connection status.
 * 
 * @async
 * @function isConnected
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Sends an HTTP response indicating the user's connection status.
 * 
 * @example
 * // Returns { isConnected: true } if the user is connected.
 */
exports.isConnected = async (req, res, next) => {
    // retourner true si l'utilisateur est connecté, false sinon
    return res.status(200).json({ isConnected: true }); 
};