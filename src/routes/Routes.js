const express = require("express");
const router = express.Router();
const addUserController = require("../controllers/user/admin-add-user");
const userController = require("../controllers/user/user-detail");
const loginController = require('../controllers/user/login');
const upload = require("../lib/upload");
const editRoleController = require('../controllers/user/admin-edit-role');
const deleteUserController = require('../controllers/user/admin-delete-user');
const addStakeholderController = require('../controllers/user/add-stakeholder');
const UserListController = require('../controllers/user/user-list');
const FormAddController = require('../controllers/forms/form-add');
const CompanyController = require('../controllers/company/company');
const FormsController = require('../controllers/forms/form-list');
const FormsDetailController = require('../controllers/forms/form-detail');
const FormsStatusController = require('../controllers/forms/forms-change-status');


let routes = (app) => {
    app.use(express.json());
    router.post("/upload", upload.single("file"), addUserController.upload);
    router.get("/user/detail", userController.handler);
    router.post("/login", loginController.handler);
    router.put("/admin/edit-role", editRoleController.handler);
    router.put("/admin/delete-user", deleteUserController.handler);
    router.post("/user/add-stakeholder/:usercode", addStakeholderController.register);
    router.put("/user/stakeholder-register-complete", addStakeholderController.registerComplete);
    router.get("/users", UserListController.handler);
    router.get("/stakeholder/list/:usercode", addStakeholderController.list);
    router.put("/stakeholder/update/:usercode", addStakeholderController.update);
    router.post("/form", FormAddController.handler);
    router.get("/company", CompanyController.list);
    router.get("/forms/:usercode", FormsController.handler);
    router.get("/user/form/:uniquekey",FormsDetailController.handler)
    router.put("/form-status", FormsStatusController.handler);




    

    app.use("/api", router);
};

module.exports = routes;