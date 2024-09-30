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
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Group.beforeCreate(async (group) => {
    const salt = await bcrypt.genSalt(10);
    group.password_hash = await bcrypt.hash(group.password_hash, salt);
});

Group.prototype.comparePassword = async function (password_hash) {
    return await bcrypt.compare(password_hash, this.password_hash);
};

module.exports = Group;