const {DataTypes, Sequelize} = require('sequelize');

const FormSchema = (sequlize, type) => sequlize.define('Form', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    FormTypeId: {
        type: type.INTEGER,
        allowNull: false
    },
    UniqueKey: {
        type: type.STRING,
        allowNull: false
    },
    Name: {
        type: type.STRING,
        allowNull: false
    },
    DepartmentId: {
        type: type.INTEGER,
        allowNull: true
    },
    InsertedDate: {
        type: type.DATE,
        allowNull: true
    },
    InsertedUser: {
        type: type.STRING,
        allowNull: false
    },
    IsApproved: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    IsEditable: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    IsDeleted: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    IsRejected: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    LessonCode: {
        type: type.STRING,
        allowNull: false
    },
    RejectReason:{
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = FormSchema;