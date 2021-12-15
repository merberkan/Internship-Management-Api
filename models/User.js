const {DataTypes, Sequelize} = require('sequelize');

const UserSchema = (sequlize, type) => sequlize.define('User', {
    Id: {
        type: type.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    UniqueKey: {
        type: type.STRING,
        allowNull: false
    },
    SchoolId: {
        type: type.STRING,
        allowNull: false
    },
    Name: {
        type: type.STRING,
        allowNull: false
    },
    Surname: {
        type: type.STRING,
        allowNull: false
    },
    Email: {
        type: type.STRING,
        allowNull: false
    },
    Password: {
        type: type.STRING,
        allowNull: false
    },
    IsDeleted: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = UserSchema;