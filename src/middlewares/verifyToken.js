const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware for verifying the authentication token.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object.
 * @throws {Error} - If authentication fails or an error occurs.
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token de l'en-tête Authorization
        const token = req.headers['authorization']?.split(' ')[1];
        
        // Vérifier si le token est présent
        if (!token) {
            return res.status(401).json({ message: 'Authentification failed' });
        }

        // Décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Récupérer l'utilisateur à partir de l'ID décodé
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Authentification failed' });
        }

        // Attacher l'utilisateur à la requête pour une utilisation ultérieure
        req.user = user;

        // Passer au middleware ou contrôleur suivant
        next();
    } catch (err) {
        // En cas d'erreur (token invalide ou autre), envoyer une réponse d'échec
        return res.status(401).json({ message: 'You need to be authenticated', error: err.message });
    }
};

module.exports = authMiddleware;