const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserGroup = sequelize.define('UserGroup', {
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

module.exports = UserGroup;