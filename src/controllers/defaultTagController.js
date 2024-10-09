const { DefaultTag } = require('../models');

/**
 * Retrieves all default tags from the database.
 * 
 * This function fetches the default tags and sends them as a JSON response. 
 * If an error occurs during the retrieval process, an error message is returned.
 * 
 * @async
 * @function getDefaultTags
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends an HTTP response with the list of default tags or an error message.
 * 
 * @throws {Error} - Throws an error if the retrieval of default tags fails.
 */
exports.getDefaultTags = async (req, res) => {
    try {
        const defaultTags = await DefaultTag.findAll();
        res.status(200).json(defaultTags);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tags par défaut", error: error.message });
    }
};