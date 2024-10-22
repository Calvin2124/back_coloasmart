const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

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

const validatePassword = (password) => {
    const schema = Joi.string()
        .min(4) // Minimum length
        .max(30) // Maximum length
        // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // Required complexity
        .required();

    return schema.validate(password);
}
// Fonction de validation de l'email
const validateNameGroup = (nameGroup) => {
    const schema = Joi.string()
        .min(4) // Longueur minimale
        .max(20) // Longueur maximale
        .required();
        
    return schema.validate(nameGroup);
};

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
    const { error : passwordError } = validatePassword(group.password);
    if (passwordError) {
        throw new Error(passwordError.details[0].message);
    }

    const { error : nameGroupError } = validateNameGroup(group.name);
    if (nameGroupError) {
        throw new Error(nameGroupError.details[0].message);
    }

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
};

module.exports = Group;