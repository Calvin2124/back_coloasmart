const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Represents a group in the database.
 * 
 * @module Group
 * @requires sequelize
 * @requires sequelize.DataTypes
 * @requires bcrypt
 * 
 * @property {string} name - The name of the group. Must be unique and cannot be null.
 * @property {string} password - The password for the group. Cannot be null.
 * 
 * @constant {Model} Group - Sequelize model representing the Group table in the database.
 * 
 * @method comparePassword - Compares a given password with the stored hashed password.
 * @param {string} password - The password to compare.
 * @returns {Promise<boolean>} - Resolves to true if the password matches, false otherwise.
 * 
 * @function associate
 * @param {Object} models - The models to associate with this group.
 * @description Defines associations with other models, including DefaultTag and GroupTag.
 */

const Group = sequelize.define('Group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Group.beforeCreate(async (group) => {
    const salt = await bcrypt.genSalt(10);
    group.password = await bcrypt.hash(group.password, salt);
});

Group.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

Group.associate = (models) => {
    Group.belongsToMany(models.DefaultTag, {
    through: 'GroupDefaultTag',
    foreignKey: 'groupId'
    });
    Group.hasMany(models.GroupTag, {
    foreignKey: 'groupId',
    as: 'customTags'
    });
    // ... autres associations existantes ...
};

module.exports = Group;