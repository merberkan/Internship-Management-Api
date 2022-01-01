const { verify, decode } = require("jsonwebtoken");
const multer = require("multer");

const userInfo =  async (req,res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const tokenData = decode(token);
    return tokenData;
};

module.exports = {
    userInfo
}

