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
        defaultValue: ''
    },
    HeadId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: ''
    },
    DeanId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: ''
    },
    CoordinatorId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: ''
    },
    StakeholderId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: ''
    },
    GraderId: {
        type: type.STRING,
        allowNull: true,
        defaultValue: ''
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