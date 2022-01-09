const {DataTypes, Sequelize} = require('sequelize');

const CompanySchema = (sequlize, type) => sequlize.define('Company', {
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
    Name: {
        type: type.STRING,
        allowNull: false
    },
    Address: {
        type: type.STRING,
        allowNull: false
    },
    Sector: {
        type: type.STRING,
        allowNull: false
    },
    PhoneNo: {
        type: type.STRING,
        allowNull: false
    },
    FaxNo: {
        type: type.STRING,
        allowNull: false
    },
    Email: {
        type: type.STRING,
        allowNull: false
    },
    WebAddress: {
        type: type.STRING,
        allowNull: false
    },
    CompanyEmployeeNo: {
        type: type.STRING,
        allowNull: false
    },
    IsDeleted: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = CompanySchema;