const {DataTypes, Sequelize} = require('sequelize');

const UserStakeholderSchema = (sequlize, type) => sequlize.define('UserStakeholder', {
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
    StakeholderId: {
        type: type.INTEGER,
        allowNull: false,
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = UserStakeholderSchema;