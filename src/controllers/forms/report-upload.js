const readXlsxFile = require("read-excel-file/node");
var fs = require("fs");
const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");
var nodemailer = require("nodemailer");
const { userInfo } = require("../../lib/middleware");
const moment = require("moment");
const pdf2base64 = require("pdf-to-base64");

const uploadPDFFile = async (req, res) => {
  const { User, UserRole, Role, Stakeholder, Form, UserForm } =
    await connectToDatabase();
  const usercode = req.params.usercode;
  const user = await userInfo(req, res);
  const isUserExist = await User.findOne({
    where: { UniqueKey: user.usercode, IsDeleted: false },
  });
  let base64OfFile;
  try {
    // Checks if file is exist
    if (req.file == undefined) {
      return res.status(400).send("Please upload an file!");
    }
    // Checks if the file exists
    let path =
      "/Users/mertberkanakdeniz/Documents/GitHub/Internship-Management-Api/Internship-Management-Api/resources/static/assets/uploads/" +
      req.file.filename;
    const isStakeholderExist = await Stakeholder.findOne({
      where: { Id: usercode },
    });
    if (!isStakeholderExist) {
      res.status(400).send({
        message: "Stakeholder Not Found",
        ok: false,
      });
    } else {
      const newFormResult = await Form.create({
        Name: isUserExist.Name + " " + isUserExist.Surname,
        FormTypeId: 5,
        UniqueKey: uuid(),
        InsertedDate: moment().utc(),
        InsertedUser: isUserExist.Id,
        DepartmentId: isUserExist.DepartmentId,
        LessonCode: 390,
      });
      const newUserFormResult = await UserForm.create({
        UniqueKey: uuid(),
        StudentId: isUserExist.Id,
        FormId: newFormResult.dataValues.Id,
        Value: path,
        SendedEmail: isStakeholderExist.Email,
      });
      //* Send email to Stakeholder to approve form
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "snolldestek@gmail.com",
          pass: "snoll123",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      //* Create the mail body
      var mailOptions = {
        from: "snolldestek@gmail.com",
        to: isStakeholderExist.Email,
        subject: `${isUserExist.Name}  ${isUserExist.Surname} Staj Raporu`,
        text: "Kurumunuzda staj yapan öğrencimize ait raporu onaylamak için http://localhost:3000/login adresinden giriş yapıp, belgelerim başlığı altından erişebilirsiniz.",
      };
      //* Sends email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).send({
        message: "Form Created Successfully",
        ok: true,
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
  uploadPDFFile,
};
