const Sequelize = require('sequelize');
const UserModel = require('../models/User');

const {
    SQL_HOST,
    SQL_USERNAME,
    SQL_PWD,
    SQL_DB,
    SQL_PORT,
    SQL_SOCKETPATH,
    SQL_TYPE
} = process.env;

const sequelize = new Sequelize(SQL_DB, SQL_USERNAME, SQL_PWD, {
    host: SQL_HOST,
    port: SQL_PORT,
    logging: console.log,
    dialect: SQL_TYPE,
    dialectOptions:{
        supportBigNumbers: true,
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
    retry: {
        match: [/Deadlock/i],
        max: 3
    }
});

const User = UserModel(sequelize, Sequelize);

const Models = {
    User
};

const connection = {};

module.exports = async(includeSequelize) => {
    // PK FK define parts



    // End of PK FK define parts
    if(includeSequelize){
        Models["sequelize"] = sequelize;
    }

    if(connection.isConnected){
        console.log(' USING EXISTING CONNECTION.');
        return Models;
    }
    const result = await sequelize.authenticate();
    connection.isConnected = true;
    console.log("CREATED A NEW CONNECTION.");

    return Models;
};