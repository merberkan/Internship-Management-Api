const {DataTypes, Sequelize} = require('sequelize');

const StakeholderCompanySchema = (sequlize, type) => sequlize.define('StakeholderCompany', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    StakeholderId: {
        type: type.INTEGER,
        allowNull: false
    },
    CompanyId: {
        type: type.INTEGER,
        allowNull: false,
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = StakeholderCompanySchema;