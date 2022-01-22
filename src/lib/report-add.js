const multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/Users/mertberkanakdeniz/Documents/GitHub/Internship-Management-Api/Internship-Management-Api/resources/static/assets/reports");
    },
    filename: (req, file, cb) => {
        console.log("test")
        console.log(file.originalname);
        cb(null, `${file.originalname}`);
    },
});

var uploadPDF = multer({ storage: storage });
module.exports = uploadPDF;