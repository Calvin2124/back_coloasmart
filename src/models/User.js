const  { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Represents a user in the database.
 * 
 * @module User
 * @requires sequelize
 * @requires sequelize.DataTypes
 * @requires bcrypt
 * 
 * @property {string} username - The username of the user. Cannot be null.
 * @property {string} email - The email of the user. Must be unique and cannot be null.
 * @property {string} password_hash - The hashed password of the user. Cannot be null.
 * 
 * @constant {Model} User - Sequelize model representing the Users table in the database.
 * 
 * @method comparePassword - Compares a given password with the stored hashed password.
 * @param {string} password_hash - The password to compare.
 * @returns {Promise<boolean>} - Resolves to true if the password matches, false otherwise.
 * 
 * @function beforeCreate
 * @param {User} user - The user instance being created.
 * @description Hashes the password before creating a new user.
 */
const User = sequelize.define('Users', {
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
    },
    password_hash: {
    type: DataTypes.STRING,
    allowNull: false
    }
});


User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
})

User.prototype.comparePassword = async function(password_hash) {
    return await bcrypt.compare(password_hash, this.password_hash);
}

module.exports = User;