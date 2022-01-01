const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors')
const initRoutes = require("./src/routes/Routes");


global.__basedir = __dirname + "/..";
dotenv.config({path : './.env'})
app.use(cors());


app.use(express.urlencoded({ extended: true }));

initRoutes(app);



let port = 3001;
app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});