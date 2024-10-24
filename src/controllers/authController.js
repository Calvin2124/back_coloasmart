
/**
 * @fileoverview This file contains the authentication controller functions.
 * @module controllers/authController
 */

const { User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
exports.register = async (req, res, next) => {
    try {
        const { username, email, password_hash, rgpd } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exist' });
        }
        const user = await User.create({ username, email, password_hash, rgpd });
        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user.id });
    } catch (err) {
        console.error("Error occurred during user registration: ", err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

/**
 * Logs in a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: false, error: 'Email ou mot de passe invalide' });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        const idUser = user.id;
        const username = user.username;
        res.status(200).json({ message: true, token, idUser, username });
    } catch (err) {
        next(err);
    }
}