const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Represents the association table between users and groups in the database.
 * 
 * @module UserGroup
 * @requires sequelize
 * @requires sequelize.DataTypes
 * 
 * @constant {Model} UserGroup - Sequelize model representing the UserGroup table in the database.
 * 
 * @typedef {Object} UserGroup
 * @property {number} userId - The ID of the associated user. Must not be null.
 * @property {number} groupId - The ID of the associated group. Must not be null.
 * @property {boolean} isAdmin - Indicates whether the user has admin privileges in the group. Defaults to false.
 * 
 * @constant {Object} options - Configuration options for the model.
 * @property {string} tableName - The explicit name of the table in the database.
 * @property {boolean} [timestamps] - Optional. Disables automatic timestamps for this model if set to false.
 */
const UserGroup = sequelize.define('UserGroup', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  // Nom de la table Users
            key: 'id'
        }
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Groups',  // Nom de la table Groups
            key: 'id'
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'UserGroups',  // Spécifiez explicitement le nom de la table si nécessaire
    // Si vous ne voulez pas les timestamps createdAt et updatedAt, décommentez la ligne suivante :
    // timestamps: false
});

module.exports = UserGroup;