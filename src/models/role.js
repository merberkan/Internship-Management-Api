const {DataTypes, Sequelize} = require('sequelize');

const RoleSchema = (sequlize, type) => sequlize.define('Role', {
    Id: {
        type: type.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    Name: {
        type: type.STRING,
        allowNull: false
    },
    IsDefaultRole: {
        type: type.BOOLEAN,
        allowNull: false
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = RoleSchema;