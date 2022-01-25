const { sign, decode, verify } = require("jsonwebtoken");
const md5 = require("md5");
const connectToDatabase = require("../../lib/database");
var nodemailer = require("nodemailer");
const { uuid } = require("../../helpers/utils");

const handler = async (req, res) => {
  const { User, UserRole, Department } = await connectToDatabase();
  const model = req.body;
  console.log("gelen body:", model);
  const user = await User.findOne({
    where: { Email: model.email, IsDeleted: false },
  });
  if (user == null) {
    res.status(400).send({
      message: "Kullanıcı Bulunamadı",
      ok: false,
    });
  } else {
    const code = uuid();
    await User.update({ PasswordKey: code }, { where: { Id: user.Id } });
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
      subject: "Kuratma Kodu",
      text:
        "Buradaki kodu gerekli alana girerek şifrenizi değiştirebilirsiniz: " +
        code,
    };
    //* Sends email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  res.status(200).send({
    message: "Kurtarma Kodu Başarıyla Gönderildi",
    ok: true,
  });
};

const changePassword = async (req, res) => {
  const { User, UserRole, Department } = await connectToDatabase();
  const model = req.body;
  console.log("gelen body:", model);
  const user = await User.findOne({
    where: { Email: model.email, PasswordKey: model.key, IsDeleted: false },
  });
  if (user == null) {
    res.status(400).send({
      message: "Kullanıcı Bulunamadı",
      ok: false,
    });
  } else {
    if (model.password !== model.passwordApprove) {
      //! Error
      res.status(400).send({
        message: "Şifreler Aynı Değil",
        ok: false,
      });
    } else {
      await User.update(
        { Password: md5(model.password), PasswordKey: null },
        { where: { Id: user.Id } }
      );
      res.status(200).send({
        message: "Şifreniz Başarılır Bir Şekilde Oluşturuldu",
        ok: true,
      });
    }
    await User.update({ PasswordKey: code }, { where: { Id: user.Id } });
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
      subject: "Kuratma Kodu",
      text:
        "Buradaki kodu gerekli alana girerek şifrenizi değiştirebilirsiniz: " +
        code,
    };
    //* Sends email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  res.status(200).send({
    message: "Kurtarma Kodu Başarıyla Gönderildi",
    ok: true,
  });
};

module.exports = {
  handler,
  changePassword,
};
