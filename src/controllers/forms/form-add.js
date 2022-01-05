const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const moment = require('moment');
const { uuid } = require("../../helpers/utils");

// {
//     fullName: 'Mert Berkan Akdeniz',
//     id: '53068195782',
//     department1: 'Bilgisayar',
//     schoolId: '217CS2014',
//     faculty: 'Mühendislik',
//     department2: 'Bilgisayar Mühendisliği',
//     company: 'KoçSistem',
//     formType: 3
//   }
const handler = async (req, res) => {
  const { User, UserRole, UserStakeholder, Form, UserForm } = await connectToDatabase();
  const user = await userInfo(req,res);
  const model = req.body;
  console.log(model);
  const isUserExist = await User.findOne({ where: { UniqueKey: user.usercode, IsDeleted: false } });
  if(!isUserExist){
    res.status(400).send({
        message: "User Not Found",
        ok: false,
      });
  }else{
      const isStakeholderExist = await UserStakeholder.findOne({
          where: {UserId: isUserExist.Id}
      })
      if(!isStakeholderExist){
        res.status(400).send({
            message: "First, create and connect stakeholder",
            ok: false,
          });
      }else{
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
            Value: JSON.stringify(model)
        })

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
