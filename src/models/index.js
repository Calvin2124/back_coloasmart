const User = require('./User');
const Group = require('./Group');
const UserGroup = require('./UserGroup');
const DefaultTag = require('./DefaultTag');
const GroupTag = require('./GroupTag');
const GroupDefaultTag = require('./GroupDefaultTag');

// Relations existantes
User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId', otherKey: 'groupId' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId', otherKey: 'userId' });

// Nouvelles relations pour les tags
Group.belongsToMany(DefaultTag, { through: GroupDefaultTag, foreignKey: 'groupId', otherKey: 'defaultTagId' });
DefaultTag.belongsToMany(Group, { through: GroupDefaultTag, foreignKey: 'defaultTagId', otherKey: 'groupId' });

Group.hasMany(GroupTag, { foreignKey: 'groupId', as: 'customTags' });
GroupTag.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = {
    User,
    Group,
    UserGroup,
    DefaultTag,
    GroupTag,
    GroupDefaultTag
};