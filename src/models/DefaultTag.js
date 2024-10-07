const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustez le chemin selon votre structure

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