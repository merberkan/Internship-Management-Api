const Sequelize = require('sequelize');
const UserModel = require('../models/user');
const RoleModel = require('../models/role');
const UserRoleModel = require('../models/userRole');
const CompanyModel = require('../models/company');
const StakeholderCompanyModel = require('../models/stakeholderCompany');
const StakeholderModel = require('../models/stakeholder');
const UserStakeholderModel = require('../models/userStakeholder');

// const {
//     SQL_HOST,
//     SQL_USERNAME,
//     SQL_PWD,
//     SQL_DB,
//     SQL_PORT,
//     SQL_SOCKETPATH,
//     SQL_TYPE
// } = process.env;


const SQL_HOST = '127.0.0.1'
const SQL_USERNAME = 'root'
const SQL_PWD = 'root'
const SQL_DB = 'Internship'
const SQL_PORT = "8889"
const SQL_SOCKETPATH= '/Applications/MAMP/tmp/mysql/mysql.sock'
const SQL_INSTANCE = ""
const SQL_TYPE = 'mysql'

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
const Role = RoleModel(sequelize, Sequelize);
const UserRole = UserRoleModel(sequelize, Sequelize);
const Company = CompanyModel(sequelize,Sequelize);
const StakeholderCompany = StakeholderCompanyModel(sequelize,Sequelize);
const Stakeholder = StakeholderModel(sequelize,Sequelize);
const UserStakeholder = UserStakeholderModel(sequelize,Sequelize);


const Models = {
    User,
    Role,
    UserRole,
    Company,
    StakeholderCompany,
    Stakeholder,
    UserStakeholder
};

const connection = {};

module.exports = async(includeSequelize) => {
    // PK FK define parts
    Models.Role.hasMany(Models.UserRole, {foreignKey: 'RoleId'});
    Models.UserRole.belongsTo(Models.Role,{foreignKey: 'RoleId'});

    Models.User.hasMany(Models.UserRole, {foreignKey: 'UserId'});
    Models.UserRole.belongsTo(Models.User,{foreignKey: 'UserId'});

    Models.Company.hasMany(Models.StakeholderCompany, {foreignKey: 'CompanyId'});
    Models.StakeholderCompany.belongsTo(Models.Company,{foreignKey: 'CompanyId'});

    Models.Stakeholder.hasMany(Models.StakeholderCompany, {foreignKey: 'StakeholderId'});
    Models.StakeholderCompany.belongsTo(Models.Stakeholder,{foreignKey: 'StakeholderId'});

    Models.User.hasMany(Models.UserStakeholder, {foreignKey: 'UserId'});
    Models.UserStakeholder.belongsTo(Models.User,{foreignKey: 'UserId'});


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