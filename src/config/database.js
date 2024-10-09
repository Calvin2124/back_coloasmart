const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

/**
 * Initializes the database connection and synchronizes the models with the database.
 * 
 * This function attempts to authenticate the connection to the database and then 
 * synchronize the models. If any errors occur during the process, 
 * an error message is logged and the process is exited.
 * 
 * @async
 * @function initializeDatabase
 * @returns {Promise<void>} - Resolves if the connection and synchronization are successful.
 * 
 * @throws {Error} - Throws an error if the connection fails or if the models cannot be synchronized.
 */
async function initializeDatabase() {
    try {
        // Tester la connexion
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Synchroniser les modèles avec la base de données
        await sequelize.sync({ alter: false });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
        process.exit(1); // Arrêter le processus en cas d'erreur
    }
}

// Appeler la fonction d'initialisation
initializeDatabase();

module.exports = sequelize;