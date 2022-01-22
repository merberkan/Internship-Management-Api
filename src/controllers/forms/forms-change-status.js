const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const moment = require("moment");
const { uuid } = require("../../helpers/utils");
var nodemailer = require("nodemailer");

const handler = async (req, res) => {
  const {
    User,
    UserRole,
    UserStakeholder,
    Stakeholder,
    Form,
    UserForm,
    FormType,
  } = await connectToDatabase();
  const user = await userInfo(req, res);
  const model = req.body;
  console.log("model:", model);
  const isUserExist = await User.findOne({
    where: { UniqueKey: user.usercode, IsDeleted: false },
    include: {
      model: UserRole,
      attributes: ["RoleId"],
      required: true,
    },
  });
  if (!isUserExist) {
    res.status(400).send({
      message: "User Not Found",
      ok: false,
    });
  } else {
    const roleId = isUserExist.UserRoles[0].dataValues.RoleId;
    if(model.status == "1"){
      const userForm = await UserForm.findOne({
        include: {
          model: Form,
          where: {
            UniqueKey: model.uniqueKey,
          },
          required: true,
        },
        attributes: ["Id"],
      });
      console.log("user form:",userForm.Id)
      if(roleId == 2){
        await UserForm.update(
          { DeanId: isUserExist.Id },
          { where: { Id: userForm.Id } }
        );
      }else if(roleId == 3){
        await UserForm.update(
          { HeadId: isUserExist.Id },
          { where: { Id: userForm.Id } }
        );
      }else if(roleId == 4){
        await UserForm.update(
          { CoordinatorId: isUserExist.Id },
          { where: { Id: userForm.Id } }
        );
      }else if(roleId == 5){
        await UserForm.update(
          { GraderId: isUserExist.Id },
          { where: { Id: userForm.Id } }
        );
        await Form.update(
          { IsApproved: true },
          { where: { UniqueKey: model.uniqueKey } }
        );
      }else if(roleId == 6){
        await UserForm.update(
          { StakeholderId: isUserExist.Id },
          { where: { Id: userForm.Id } }
        );
      }
    }else{
      await Form.update(
        { IsRejected: true, RejectReason: model.rejectReason },
        { where: { UniqueKey: model.uniqueKey } }
      );
    }
    
    
  }


  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.status(200).send({
    message: "Form Status Changed Successfully",
    ok: true,
  });
};

module.exports = {
  handler,
};
