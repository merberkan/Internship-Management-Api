const {DataTypes, Sequelize} = require('sequelize');

const FormTypeSchema = (sequlize, type) => sequlize.define('FormType', {
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

module.exports = FormTypeSchema;