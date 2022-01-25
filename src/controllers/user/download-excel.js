const {
    sign,
    decode,
    verify
} = require('jsonwebtoken');
const md5 = require('md5');
const connectToDatabase = require("../../lib/database");

const handler = async (req, res) => {
    let path =  "/Users/mertberkanakdeniz/Documents/GitHub/Internship-Management-Api/Internship-Management-Api/resources/static/assets/uploads/ornek_excel.xlsx";
    res.download(path);
}

module.exports = {
    handler
};