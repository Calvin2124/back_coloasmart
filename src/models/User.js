const  { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('Users', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
    },
    password_hash: {
    type: DataTypes.STRING,
    allowNull: false
    }
});


User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
})

User.prototype.comparePassword = async function(password_hash) {
    return await bcrypt.compare(password_hash, this.password_hash);
}

module.exports = User;