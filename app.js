const express = require('express');
const path = require('path');
// const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
// const session = require('express-session');

// git check


dotenv.config({path : './.env'})
const app = express();

//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended : false}));

//parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());

// app.use(session({ 
//     secret: 'Özel-Anahtar',
//     resave: false,
//     saveUninitialized: true,
// }))

// db.connect((error) => {
//     if (error) {
//         console.log(error)
//     } else {
//         console.log("MYSQL Connected...")
//     }
// })

//define routes
app.get("/", (req, res) => {
    console.log("catched")
});
// app.use('/', require('./routes/pages'));
app.use('/user' ,require('./routes/user'));
// app.use('/adminPanel',require('./routes/adminPanel'));
// app.use('/ownerPanel',require('./routes/ownerPanel'));
// app.use('/filterEvent',require('./routes/filterEvent'));
// app.use((req,res) => {
//     if(req.statusCode == null || req.statusCode == 404){
//         res.redirect('/notFound');
//     }
// });


app.listen(3000, () => {
    console.log("server started at port 3000 ");
});