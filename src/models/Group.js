const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

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