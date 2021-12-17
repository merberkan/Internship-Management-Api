// const db = require("../../models");
// const Tutorial = db.tutorials;

const readXlsxFile = require("read-excel-file/node");
var fs = require("fs");
const connectToDatabase = require("../../lib/database");
const { resolve } = require("path");

const upload = async (req, res) => {
  const { User } = await connectToDatabase();
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      "/Users/mertberkanakdeniz/Documents/GitHub/Internship-Management-Api/Internship-Management-Api/resources/static/assets/uploads/" + req.file.filename;
    
      const excelData = new Promise(async (resolve, reject) => {
        await readXlsxFile(path).then((rows) => {
            let data = [];
          // skip header
          rows.shift();
    
          rows.forEach((row) => {
            data.push({
              name: row[0],
              surname: row[1],
              schoolId: row[2],
              password: row[3],
              email: row[4],
            });
          });
    
          fs.unlinkSync(path);
          resolve(data);
        });
      })
    // for (let i = 0; i < data.length; i++) {
    //     const result = await User.create({
    //         UniqueKey: "123456",
    //         Name: data.name,
    //         Surname: data.surname,
    //         SchoolId: data.schoolId,
    //         Password: data.password,
    //         Email: data.email,
    //       });
    // }
    
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      data: data,
    });
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
