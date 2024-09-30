const { User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; 

exports.register = async (req, res, next) => {
    console.log(req.body);
    try {
        const { username, email, password_hash } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: true });
        }

        const user = await User.create({ username, email, password_hash });
        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user.id });
    } catch (err) {
        console.error("Error occurred during user registration: ", err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email ou mot de passe invalide' });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '6h' });
        const idUser = user.id;
        res.status(200).json({ message: 'Connexion réussie', token, idUser });
    } catch (err) {
        next(err);
    }
}