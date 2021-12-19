const {DataTypes, Sequelize} = require('sequelize');

const UserRoleSchema = (sequlize, type) => sequlize.define('UserRole', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    UserId: {
        type: type.STRING,
        allowNull: false
    },
    RoleId: {
        type: type.BIGINT,
        allowNull: false,
        references: {
            model: 'Role',
            key: 'Id',
        },
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = UserRoleSchema;