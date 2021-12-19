const readXlsxFile = require("read-excel-file/node");
var fs = require("fs");
const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");

const upload = async (req, res) => {
  const { User, UserRole, Role } = await connectToDatabase();
  try {
    // Checks if file is exist
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    // Checks if the file exists
    let path =
      "/Users/mertberkanakdeniz/Documents/GitHub/Internship-Management-Api/Internship-Management-Api/resources/static/assets/uploads/" +
      req.file.filename;
    // Read data from excel
    const excelData = await readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();
      let data = [];
      // crawls indexes
      rows.forEach((row) => {
        data.push({
          name: row[0],
          surname: row[1],
          schoolId: row[2].toString(),
          password: row[3].toString(),
          email: row[4],
          roleId: row[5].toString(),
        });
      });
      // Deletes the file from given path
      fs.unlinkSync(path);
      // returns data
      return data;
    });
    if (excelData.length > 1) {
      const roles = await Role.findAll({
        attributes: ['Id']
      }).map((t) => { return {id: t.Id}})
      const users = await User.findAll({
        where: {IsDeleted:false},
        attributes: ['Email']
      }).map((t) => { return {email: t.Email}})
      // Adds all the data in the Excel file to the database
      for (let i = 0; i < excelData.length; i++) {
        let tmp = excelData[i];
        const roleCheck = roles.find(w => w.id == tmp.roleId);
        const userCheck = users.find(w => w.email == tmp.email);
        if(roleCheck && !userCheck){
          const userResult = await User.create({
            UniqueKey: uuid(),
            Name: tmp.name,
            Surname: tmp.surname,
            SchoolId: tmp.schoolId,
            Password: md5(tmp.password),
            Email: tmp.email,
          });
          const userRoleResult = await UserRole.create({
            UserId: userResult.dataValues.Id,
            RoleId: tmp.roleId,
          });
        }
      }
      // Responds to client
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        data: excelData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

module.exports = {
  upload,
};
