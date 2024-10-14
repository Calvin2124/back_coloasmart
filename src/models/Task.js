const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajustez le chemin selon votre structure

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tagColor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taskText: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    groupId: {  // Assurez-vous qu'il n'y a pas de doublon ici
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Groups',
            key: 'id',
        },
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
    tableName: 'Tasks',
});

module.exports = Task;