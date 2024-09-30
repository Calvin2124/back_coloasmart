const { User, Group, UserGroup } = require('../models');

exports.createGroup = async (req, res) => {
try {
    const { name, password, userId } = req.body;
    
    const group = await Group.create({ name, password });
    await UserGroup.create({ UserId: userId, GroupId: group.id, isAdmin: true });

    res.status(201).json({ message: 'Groupe créé avec succès', group });
} catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Un groupe avec ce nom existe déjà.' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du groupe', error: error.message });
}
};

exports.joinGroup = async (req, res) => {
try {
    const { userId, groupName, password } = req.body;
    
    const group = await Group.findOne({ where: { name: groupName } });
    if (!group) {
    return res.status(404).json({ message: 'Groupe non trouvé.' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, group.password);
    if (!isPasswordValid) {
    return res.status(401).json({ message: 'Mot de passe incorrect pour le groupe.' });
    }

    const [userGroup, created] = await UserGroup.findOrCreate({
    where: { UserId: userId, GroupId: group.id },
    defaults: { isAdmin: false }
    });

    if (!created) {
    return res.status(400).json({ message: 'L\'utilisateur est déjà membre de ce groupe.' });
    }

    res.status(200).json({ message: 'Utilisateur ajouté au groupe avec succès' });
} catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur au groupe", error: error.message });
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
    where: { UserId: userId, GroupId: group.id }
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