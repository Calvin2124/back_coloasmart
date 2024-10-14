const User = require('./User');
const Group = require('./Group');
const UserGroup = require('./UserGroup');
const DefaultTag = require('./DefaultTag');
const GroupTag = require('./GroupTag');
const GroupDefaultTag = require('./GroupDefaultTag');
const Task = require('./Task');

/**
 * Defines the associations between the User, Group, DefaultTag, and GroupTag models.
 * 
 * @module Associations
 * @requires User
 * @requires Group
 * @requires DefaultTag
 * @requires GroupTag
 * @requires UserGroup
 * @requires GroupDefaultTag
 * 
 * @description
 * This module establishes the relationships between various models in the application.
 * 
 * Existing relationships:
 * - A user can belong to many groups, and a group can have many users, 
 *   through the UserGroup join table.
 * 
 * - Groups can have multiple default tags and vice versa, through the GroupDefaultTag join table.
 * 
 * - Groups can have many custom tags associated with them via the GroupTag model.
 * 
 * @example
 * // User-Group relationship
 * User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId', otherKey: 'groupId' });
 * Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId', otherKey: 'userId' });
 * 
 * // Group-DefaultTag relationship
 * Group.belongsToMany(DefaultTag, { through: GroupDefaultTag, foreignKey: 'groupId', otherKey: 'defaultTagId' });
 * DefaultTag.belongsToMany(Group, { through: GroupDefaultTag, foreignKey: 'defaultTagId', otherKey: 'groupId' });
 * 
 * // Group-GroupTag relationship
 * Group.hasMany(GroupTag, { foreignKey: 'groupId', as: 'customTags' });
 * GroupTag.belongsTo(Group, { foreignKey: 'groupId' });
 * 
 * @returns {Object} - An object containing the models and their associations.
 */
// Relations existantes
User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId', otherKey: 'groupId' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId', otherKey: 'userId' });

// Nouvelles relations pour les tags
Group.belongsToMany(DefaultTag, { through: GroupDefaultTag, foreignKey: 'groupId', otherKey: 'defaultTagId' });
DefaultTag.belongsToMany(Group, { through: GroupDefaultTag, foreignKey: 'defaultTagId', otherKey: 'groupId' });

Group.hasMany(GroupTag, { foreignKey: 'groupId', as: 'customTags' });
GroupTag.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Task, { foreignKey: 'idUser' });
Task.belongsTo(User, { foreignKey: 'idUser' });

Group.hasMany(Task, { foreignKey: 'groupId' });
Task.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = {
    User,
    Group,
    UserGroup,
    DefaultTag,
    GroupTag,
    GroupDefaultTag, 
    Task
};