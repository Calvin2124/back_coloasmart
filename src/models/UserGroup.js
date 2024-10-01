const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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