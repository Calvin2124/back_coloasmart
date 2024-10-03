const { User, Group, UserGroup } = require('../models');
const bcryptjs = require('bcryptjs');

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

    res.status(201).json({ message: 'Groupe créé avec succès', group });
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
            res.status(200).json({ message: 'Utilisateur ajouté au groupe avec succès' });
        } catch (dbError) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur au groupe:', dbError);
            res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur au groupe", error: dbError.message });
        }
    } catch (error) {
        console.error('Erreur générale:', error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

exports.leaveGroup = async (req, res) => {
try {
    const { userId, groupName } = req.body;
    
    const group = await Group.findOne({ where: { name: groupName } });
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

exports.getUserGroups = async (req, res) => {
try {
    const { userId } = req.params;
    
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