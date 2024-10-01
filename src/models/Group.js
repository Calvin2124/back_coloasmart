const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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

module.exports = Group;