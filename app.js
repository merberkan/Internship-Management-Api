const express = require("express");
const app = express();
const dotenv = require("dotenv");
const initRoutes = require("./src/routes/Routes");

global.__basedir = __dirname + "/..";
dotenv.config({path : './.env'})

app.use(express.urlencoded({ extended: true }));
initRoutes(app);
app.use(express.json());



let port = 3000;
app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});