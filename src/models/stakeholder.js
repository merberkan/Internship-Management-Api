const {DataTypes, Sequelize} = require('sequelize');

const StakeholderSchema = (sequlize, type) => sequlize.define('Stakeholder', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    Fullname: {
        type: type.STRING,
        allowNull: false
    },
    Title: {
        type: type.STRING,
        allowNull: true
    },
    Email: {
        type: type.STRING,
        allowNull: false
    },
    IsDeleted: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    IsConfirmed: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = StakeholderSchema;