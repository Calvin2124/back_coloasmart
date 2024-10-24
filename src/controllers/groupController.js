const { User, Group, UserGroup, DefaultTag, GroupDefaultTag } = require('../models');
const bcryptjs = require('bcryptjs');


/**
 * Creates a new group, associates default tags, and assigns the user as an administrator of the group.
 * 
 * @async
 * @function createGroup
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the group to create.
 * @param {string} req.body.password - The password for the group.
 * @param {number} req.body.userId - The ID of the user creating the group.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends an HTTP response with the result of the group creation.
 * 
 * @throws {SequelizeUniqueConstraintError} - If a group with the same name already exists.
 * @throws {SequelizeValidationError} - If validation errors occur.
 * @throws {Error} - If a generic error occurs during group creation.
 */
exports.createGroup = async (req, res) => {
    try {
        const { name, password, userId } = req.body;
        const trimmedName = name.trim();

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si le groupe existe déjà
        const existingGroup = await Group.findOne({ where: { name: trimmedName } });
        if (existingGroup) {
            return res.status(400).json({ message: 'Un groupe avec ce nom existe déjà.' });
        }

        // Créer le groupe
        const group = await Group.create({ name: trimmedName, password });

        // Créer l'association UserGroup
        await UserGroup.create({
            userId: userId,
            groupId: group.id,
            isAdmin: true
        });

        // Récupérer tous les tags par défaut
        const defaultTags = await DefaultTag.findAll();

        // Associer les tags par défaut au groupe
        await Promise.all(defaultTags.map(tag => 
            GroupDefaultTag.create({ groupId: group.id, defaultTagId: tag.id })
        ));

        // Récupérer le groupe avec ses tags associés
        const groupWithTags = await Group.findByPk(group.id, {
            include: [
                { 
                    model: DefaultTag,
                    through: { attributes: [] } // Cela exclut les attributs de la table de jointure
                }
            ]
        });

        res.status(201).json({ 
            message: 'Groupe créé avec succès', 
            group: {
                id: groupWithTags.id,
                name: groupWithTags.name,
                tags: groupWithTags.DefaultTags
            }
        });
    } catch (error) {
        console.log('Error type:', error.name);
        console.log('Error message:', error.message);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Un groupe avec ce nom existe déjà.' });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Erreur de validation', errors: error.errors });
        }
        res.status(500).json({ message: 'Erreur lors de la création du groupe', error: error.message });
    }
};

/**
 * Allows a user to join a group by validating the group password and adding the user to the group.
 * 
 * @async
 * @function joinGroup
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user and group information.
 * @param {number|string} req.body.userId - The ID of the user attempting to join the group.
 * @param {string} req.body.groupName - The name of the group the user wants to join.
 * @param {string} req.body.password - The password for the group.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends an HTTP response with the result of the user joining the group.
 * 
 * @throws {Error} - Throws errors for invalid input, password validation failure, or database issues.
 */
exports.joinGroup = async (req, res) => {
    try {
        const { userId, groupName, password } = req.body;

        if (!userId || !groupName || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Convertir userId en nombre
        const userIdNum = parseInt(userId, 10);
        if (isNaN(userIdNum)) {
            return res.status(400).json({ message: 'UserId invalide.' });
        }

        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }

        if (!group.password) {
            return res.status(500).json({ message: 'Erreur de configuration du groupe.' });
        }

        try {
            const isPasswordValid = await bcryptjs.compare(password, group.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Mot de passe incorrect pour le groupe.' });
            }
        } catch (bcryptError) {
            return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
        }

        try {
            const [userGroup, created] = await UserGroup.findOrCreate({
                where: { userId: userIdNum, groupId: group.id },
                defaults: { 
                    userId: userIdNum,
                    groupId: group.id,
                    isAdmin: false 
                }
            });

            if (!created) {
                return res.status(400).json({ message: 'L\'utilisateur est déjà membre de ce groupe.' });
            }
            res.status(200).json({ message: 'Utilisateur ajouté au groupe avec succès', idGroup: group.id });
        } catch (dbError) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur au groupe:', dbError);
            res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur au groupe", error: dbError.message });
        }
    } catch (error) {
        console.error('Erreur générale:', error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

/**
 * Allows a user to leave a specified group.
 * 
 * @async
 * @function leaveGroup
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user and group information.
 * @param {number|string} req.body.userId - The ID of the user leaving the group.
 * @param {string} req.body.groupName - The name of the group the user wants to leave.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends an HTTP response indicating the result of the user's departure from the group.
 * 
 * @throws {Error} - Throws errors for group not found, user not a member, or database issues.
 */
exports.leaveGroup = async (req, res) => {
try {
    const { groupId, userId } = req.body;
    
    const group = await Group.findOne({ where: { id: groupId } });
    if (!group) {
    return res.status(404).json({ message: 'Groupe non trouvé.' });
    }

    const userGroup = await UserGroup.findOne({ 
    where: { userId: userId, groupId: group.id }
    });

    if (!userGroup) {
    return res.status(400).json({ message: 'L\'utilisateur n\'est pas membre de ce groupe.' });
    }

    await userGroup.destroy();

    res.status(200).json({ message: 'Utilisateur a quitté le groupe avec succès' });
} catch (error) {
    res.status(500).json({ message: 'Erreur lors du départ de l\'utilisateur du groupe', error: error.message });
}
};


/**
 * Retrieves the groups associated with a specified user, including their admin status.
 * 
 * @async
 * @function getUserGroups
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user information.
 * @param {number|string} req.body.id - The ID of the user whose groups are being retrieved.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends an HTTP response with the list of groups the user is associated with.
 * 
 * @throws {Error} - Throws errors for user not found or database issues.
 */
exports.getUserGroups = async (req, res) => {
try {
    const userId = req.body.id;
    const user = await User.findByPk(userId, {
    include: [{
        model: Group,
        through: { attributes: ['isAdmin'] }
    }]
    });

    if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const groups = user.Groups.map(group => ({
    id: group.id,
    name: group.name,
    isAdmin: group.UserGroup.isAdmin
    }));

    res.status(200).json(groups);
} catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des groupes de l'utilisateur", error: error.message });
}
};

/**
 * Retrieves the user associated with a specified group.
 * 
 * @async
 * @function getGroupMember
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing group and user information.
 * @param {number|string} req.body.groupId - The ID of the group.
 * @param {number|string} req.body.userId - The ID of the user to be retrieved from the group.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - Sends an HTTP response with the user information if found.
 * 
 * @throws {Error} - Throws errors for group not found, user not a member, or database issues.
 */
exports.getGroupMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé.' });
        }
        const userGroup = await UserGroup.findOne({
            where: { userId: userId, groupId: group.id }
        });
        if (!userGroup) {
            return res.status(400).json({ message: 'L\'utilisateur n\'est pas membre de ce groupe.' });
        }
        res.status(200).json({ message: 'Utilisateur trouvé avec succès', user: userGroup.User, group: userGroup.Group });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du membre du groupe", error: error.message });
    }
};