const {DataTypes, Sequelize} = require('sequelize');

const DepartmentSchema = (sequlize, type) => sequlize.define('Department', {
    Id: {
        type: type.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    Name: {
        type: type.STRING,
        allowNull: false
    }
},{
    createdAt:false,
    freezeTableName: true,
    updatedAt: false,
});

module.exports = DepartmentSchema;