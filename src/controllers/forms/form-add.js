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
    if(model.formType === 1 || model.formType === 2 || model.formType ===6){
      const isStakeholderExist = await Stakeholder.findOne({
        where: { Email: model.companyPersonMail },
      });
      if (!isStakeholderExist) {
        res.status(400).send({
          message: "Stakeholder Not Found",
          ok: false,
        });
      } else {
        const today = moment().utc();
        const internStartDate = moment(model.studentInternStart).utc();
        const internEndDate = moment(model.studentInternEnd).utc();
        const difference = moment.duration(internStartDate.diff(today)).asDays();
        const difference2 = moment.duration(internEndDate.diff(today)).asDays();
        const difference3 = moment.duration(internEndDate.diff(internStartDate)).asDays();
        if(difference <=14){
          console.log("if icine girdi")
          res.status(400).send({
            message: "There should be a difference of at least 14 days between the internship start date and today.",
            ok: false,
          });
        }else if(difference2 <=34){
          res.status(400).send({
            message: "There should be a minimum difference of 34 days between the internship end date and today's date",
            ok: false,
          });
        } else if(difference3 <= 20){
          res.status(400).send({
            message: "You can't do an internship for less than 20 days.",
            ok: false,
          });
        }else{
        const newFormResult = await Form.create({
          Name: model.fullName,
          FormTypeId: model.formType,
          UniqueKey: uuid(),
          InsertedDate: moment().utc(),
          InsertedUser: isUserExist.Id,
          DepartmentId: isUserExist.DepartmentId,
          LessonCode: model.lessonCode
        });
        const newUserFormResult = await UserForm.create({
          UniqueKey: uuid(),
          StudentId: isUserExist.Id,
          FormId: newFormResult.dataValues.Id,
          Value: JSON.stringify(model),
          SendedEmail: model.companyPersonMail
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
            subject: `${isUserExist.Name}  ${isUserExist.Surname} Staj Evrağı`,
            text:
              "Kurumunuzda staj yapacak öğrencimize ait formu doldurmak için http://localhost:3000/login adresinden giriş yapıp, belgelerim başlığı altından erişebilirsiniz."
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
      }
    }else{
      const newFormResult = await Form.create({
        Name: model.fullName,
        FormTypeId: model.formType,
        UniqueKey: uuid(),
        InsertedDate: moment().utc(),
        InsertedUser: isUserExist.Id,
        DepartmentId: isUserExist.DepartmentId,
        LessonCode: model.lessonCode
      });
      const newUserFormResult = await UserForm.create({
        UniqueKey: uuid(),
        StudentId: isUserExist.Id,
        FormId: newFormResult.dataValues.Id,
        StakeholderId: "pass",
        Value: JSON.stringify(model),
      });
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
