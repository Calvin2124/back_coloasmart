const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

/**
 * Represents a user in the database.
 * 
 * @module User
 * @requires sequelize
 * @requires sequelize.DataTypes
 * @requires bcrypt
 * @requires joi
 * 
 * @property {string} username - The username of the user. Cannot be null.
 * @property {string} email - The email of the user. Must be unique and cannot be null.
 * @property {string} password_hash - The hashed password of the user. Cannot be null.
 * 
 * @constant {Model} User - Sequelize model representing the Users table in the database.
 * 
 * @method comparePassword - Compares a given password with the stored hashed password.
 * @param {string} password - The password to compare.
 * @returns {Promise<boolean>} - Resolves to true if the password matches, false otherwise.
 * 
 * @function beforeCreate
 * @param {User} user - The user instance being created.
 * @description Hashes the password before creating a new user.
 */

// Fonction de validation du mot de passe
const validatePassword = (password) => {
    const schema = Joi.string()
        .min(4) // Longueur minimale
        .max(30) // Longueur maximale
        // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // Complexité requise
        .required();
        
    return schema.validate(password);
};

// Fonction de validation de l'email
const validateEmail = (email) => {
    const schema = Joi.string()
        .email() // Vérifie que l'email est au bon format
        .required();
        
    return schema.validate(email);
};

const User = sequelize.define('Users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rgpd: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

// Hook pour hacher le mot de passe avant la création
User.beforeCreate(async (user) => {
    // Validation du mot de passe
    const { error: passwordError } = validatePassword(user.password_hash);
    if (passwordError) {
        throw new Error(passwordError.details[0].message); // Lève une erreur si la validation échoue
    }

    // Validation de l'email
    const { error: emailError } = validateEmail(user.email);
    if (emailError) {
        throw new Error(emailError.details[0].message); // Lève une erreur si la validation échoue
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
});

// Méthode pour comparer le mot de passe
User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;