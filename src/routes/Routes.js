const express = require("express");
const router = express.Router();
const addUserController = require("../controllers/user/admin-add-user");
const userController = require("../controllers/user/user-detail");
const loginController = require('../controllers/user/login');
const upload = require("../lib/upload");


let routes = (app) => {
    app.use(express.json());
    router.post("/upload", upload.single("file"), addUserController.upload);
    router.get("/user/detail", userController.handler);
    router.post("/login", loginController.handler);
    app.use("/api", router);
};

module.exports = routes;