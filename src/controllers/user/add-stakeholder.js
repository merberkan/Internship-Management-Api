const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");
var nodemailer = require("nodemailer");

const register = async (req, res) => {
  const { User, UserRole } = await connectToDatabase();
  const model = req.body;
  //* Checks if the user exist
  const isExist = await User.findOne({
    where: { Email: model.email, IsDeleted: false },
  });
  if (isExist) {
    //! If email used, send error
    res.status(400).send({
      message: "That Email is already in use!",
      data: { isSuccess: false },
    });
  } else {
    try {
      //* Creates new User with given parameter
      const userResult = await User.create({
        UniqueKey: uuid(),
        Name: model.name,
        Surname: model.surname,
        SchoolId: "",
        Password: md5(uuid()),
        Email: model.email,
      });
      //* Creates new UserRole as Stakeholder
      const userRoleResult = await UserRole.create({
        UserId: userResult.dataValues.Id,
        RoleId: 6,
      });
      //* Creating transport to send email
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
        to: model.email,
        subject: "Tebrikler",
        text:
          "Burada ki bağlantıyı kullanarak şifrenizi oluşturabilirsiniz http://localhost:3000/completeRegister/" +
          userResult.dataValues.UniqueKey
      };
      //* Sends email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      //* Success
      res.status(200).send({
        message: "Email sent successfully",
        data: { isSend: true },
      });
    } catch (error) {
      //! Error
      res.status(400).send({
        message: "[ADD STAKEHOLDER ERROR]",
        data: { error: error },
      });
    }
  }
};

const registerComplete = async (req, res) => {
  const { User } = await connectToDatabase();
  const model = req.body;
  //* Checks if the user exist
  const isExist = await User.findOne({
    where: { UniqueKey: model.uniqueKey, IsDeleted: false },
  });
  if (isExist) {
    //* Checks if the passwords are equeal
    if (model.password !== model.passwordApprove) {
      //! Error
      res.status(400).send({
        message: "[REGISTER COMPLETE STAKEHOLDER ERROR]",
        data: { error: "password do not match!" },
      });
    } else {
      //* Update User Password
      await User.update(
        { Password: md5(model.password) },
        { where: { Id: isExist.Id } }
      );
      //* Return success result
      res.status(200).send({
        message: "Password approved",
        data: { isSuccess: true },
      });
    }
  } else {
    //! Error
    res.status(400).send({
      message: "[REGISTER COMPLETE CONTROLLER]",
      data: { isSuccess: false, error: "USER NOT FOUND!" },
    });
  }
};

module.exports = {
  register,
  registerComplete,
};
