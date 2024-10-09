const { DefaultTag } = require('../models');

exports.getDefaultTags = async (req, res) => {
    try {
        /**
         * Retrieves all default tags.
         *
         * @returns {Promise<Array>} The array of default tags.
         */
        const defaultTags = await DefaultTag.findAll();
        res.status(200).json(defaultTags);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tags par défaut", error: error.message });
    }
};