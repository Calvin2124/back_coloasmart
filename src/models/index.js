const User = require('./User');
const Group = require('./Group');
const UserGroup = require('./UserGroup');

User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId', otherKey: 'groupId' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId', otherKey: 'userId' });

module.exports = {
    User,
    Group,
    UserGroup
};