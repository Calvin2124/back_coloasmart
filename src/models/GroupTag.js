const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustez le chemin selon votre structure

const GroupTag = sequelize.define('GroupTag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isHexColor: true
        }
    }
});

module.exports = GroupTag;