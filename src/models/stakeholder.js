const {DataTypes, Sequelize} = require('sequelize');

const StakeholderSchema = (sequlize, type) => sequlize.define('Stakeholder', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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

module.exports = StakeholderSchema;