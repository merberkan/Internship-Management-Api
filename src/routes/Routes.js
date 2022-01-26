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
const FormUpdateController = require('../controllers/forms/form-update');
const ReportUploadController = require('../controllers/forms/report-upload');
const UserUpdateController = require('../controllers/user/user-update');
const DownloadExcelController = require('../controllers/user/download-excel');
const ForgetPasswordController = require('../controllers/user/forget-password');


let routes = (app) => {
    app.use(express.json());
    router.post("/upload", upload.single("file"), addUserController.upload);
    router.get("/user/detail", userController.handler);
    router.post("/login", loginController.handler);
    router.post("/forget-password", ForgetPasswordController.handler);
    router.put("/forget-password-approve", ForgetPasswordController.changePassword);
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
    router.put("/user/form-update/:uniquekey",FormUpdateController.handler)
    router.post("/upload/report/:usercode", upload.single("file"), ReportUploadController.uploadPDFFile);
    router.put("/user/update", UserUpdateController.handler);
    router.put("/company/update", CompanyController.update);
    router.get("/company/detail/:uniquekey", CompanyController.detail);
    router.get("/download", DownloadExcelController.handler);


    app.use("/api", router);
};

module.exports = routes;