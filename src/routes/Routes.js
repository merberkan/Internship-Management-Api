const express = require("express");
const router = express.Router();
const addUserController = require("../controllers/user/admin-add-user");
const userController = require("../controllers/user/user-detail");
const loginController = require('../controllers/user/login');
const upload = require("../lib/upload");
const editRoleController = require('../controllers/user/admin-edit-role');
const deleteUserController = require('../controllers/user/admin-delete-user');
const addStakeholderController = require('../controllers/user/add-stakeholder');


let routes = (app) => {
    app.use(express.json());
    router.post("/upload", upload.single("file"), addUserController.upload);
    router.get("/user/detail/:uniqueKey", userController.handler);
    router.post("/login", loginController.handler);
    router.put("/admin/edit-role", editRoleController.handler);
    router.put("/admin/delete-user", deleteUserController.handler);
    router.post("/user/add-stakeholder", addStakeholderController.register);
    router.put("/user/stakeholder-register-complete", addStakeholderController.registerComplete);

    app.use("/api", router);
};

module.exports = routes;