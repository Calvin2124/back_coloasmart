const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustez le chemin selon votre structure

/**
 * Represents a default tag in the database.
 * 
 * @module DefaultTag
 * @requires sequelize
 * @requires sequelize.DataTypes
 * 
 * @typedef {Object} DefaultTag
 * @property {string} name - The name of the tag. Must be unique and cannot be null.
 * @property {string} color - The color of the tag, represented as a hexadecimal string. Cannot be null.
 * 
 * @constant {Model} DefaultTag - Sequelize model representing the DefaultTag table in the database.
 */
const DefaultTag = sequelize.define('DefaultTag', {
name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
},
color: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
    isHexColor: true
    }
}
});

module.exports = DefaultTag;