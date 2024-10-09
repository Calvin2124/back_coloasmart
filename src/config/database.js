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
 * @returns {Promise<void>} A promise that resolves when the database is initialized and synchronized successfully.
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