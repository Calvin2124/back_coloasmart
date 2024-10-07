const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustez le chemin selon votre structure

const GroupDefaultTag = sequelize.define('GroupDefaultTag', {}, { timestamps: false });

module.exports = GroupDefaultTag;