const {DataTypes, Sequelize} = require('sequelize');

const UserFormSchema = (sequlize, type) => sequlize.define('UserForm', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    UniqueKey: {
        type: type.STRING,
        allowNull: false
    },
    StudentId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    HeadId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    DeanId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    CoordinatorId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    StakeholderId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    GraderId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    FormId: {
        type: type.INTEGER,
        allowNull: false,
    },
    Value:{
        type: type.STRING,
        allowNull: false,
    },
    SendedEmail:{
        type: type.STRING,
        allowNull: true,
    },
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = UserFormSchema;