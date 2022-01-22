const multer = require("multer");

// const excelFilter = (req, file, cb) => {
//     if (
//         file.mimetype.includes("excel") ||
//         file.mimetype.includes("spreadsheetml")
//     ) {
//         cb(null, true);
//     } else {
//         cb("Please upload only excel file.", false);
//     }
// };
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/Users/mertberkanakdeniz/Documents/GitHub/Internship-Management-Api/Internship-Management-Api/resources/static/assets/uploads");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, `${file.originalname}`);
    },
});

var uploadFile = multer({ storage: storage });
module.exports = uploadFile;