const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const moment = require("moment");
const { uuid } = require("../../helpers/utils");
var nodemailer = require("nodemailer");


const handler = async (req, res) => {
  const { User, UserRole, UserStakeholder, Stakeholder, Form, UserForm } =
    await connectToDatabase();
  const user = await userInfo(req, res);
  const model = req.body;
  console.log(model);
  const isUserExist = await User.findOne({
    where: { UniqueKey: user.usercode, IsDeleted: false },
  });
  if (!isUserExist) {
    res.status(400).send({
      message: "User Not Found",
      ok: false,
    });
  } else {
    const isStakeholderExist = await UserStakeholder.findOne({
      where: { UserId: isUserExist.Id },
      include: {
        model: Stakeholder,
        attributes: ['Email']
      }
    });
    if (!isStakeholderExist) {
      res.status(400).send({
        message: "First, create and connect stakeholder",
        ok: false,
      });
    } else {
      const newFormResult = await Form.create({
        FormTypeId: model.formType,
        UniqueKey: uuid(),
        InsertedDate: moment().utc(),
        InsertedUser: isUserExist.Id,
      });
      const newUserFormResult = await UserForm.create({
        UniqueKey: uuid(),
        StudentId: isUserExist.Id,
        FormId: newFormResult.dataValues.Id,
        Value: JSON.stringify(model),
      });
      if (model.formType == 1 || model.formType == 2) {
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
          to: isStakeholderExist.Stakeholder.Email,
          subject: `${isUserExist.Name}  ${isUserExist.Surname} Staj Evrağı`,
          text:
            "Kurumunuzda staj yapacak öğrencimize ait formu doldurmak için http://localhost:3000/student-forms/" +
            newUserFormResult.dataValues.UniqueKey +" adresine tıklayınız."
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
        message: "Form Created Successfully",
        ok: true,
      });
    }
  }
};

module.exports = {
  handler,
};
