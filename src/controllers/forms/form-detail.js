const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const moment = require("moment");
const { uuid } = require("../../helpers/utils");
var nodemailer = require("nodemailer");
var fs = require("fs");
const { utc } = require("moment");

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
  const formUniqueKey = req.params.uniquekey;
  let list;
  const isUserExist = await User.findOne({
    where: { UniqueKey: user.usercode, IsDeleted: false },
  });
  if (!isUserExist) {
    res.status(400).send({
      message: "User Not Found",
      ok: false,
    });
  } else {
    if (user.role == 5 || user.role == 6) {
      list = await UserForm.findAll({
        include: {
          model: Form,
          include: {
            model: FormType,
            attributes: ["Name"],
            required: true,
          },
          where: { UniqueKey: formUniqueKey },
          attributes: ["FormTypeId", "Name", "IsRejected"],
          required: true,
        },
        attributes: [
          "Id",
          "HeadId",
          "DeanId",
          "CoordinatorId",
          "StakeholderId",
          "GraderId",
          "Value",
        ],
      }).map((t) => {
        let confirmed = false;
        let formTypeId = t.dataValues.Form.dataValues.FormTypeId;
        if (formTypeId !== 5) {
          t.dataValues.Value = JSON.parse(t.dataValues.Value);
          t.dataValues.Value.companyPersonDate = moment()
            .utc()
            .format("DD/MM/YYYY");
        }
        if (user.role == 5 && t.dataValues.GraderId) {
          confirmed = true;
        } else if (user.role == 6 && t.dataValues.StakeholderId) {
          confirmed = true;
        }
        return {
          HeadId: t.dataValues.HeadId,
          DeanId: t.dataValues.DeanId,
          CoordinatorId: t.dataValues.CoordinatorId,
          StakeholderId: t.dataValues.StakeholderId,
          GraderId: t.dataValues.GraderId,
          Value: t.dataValues.Value,
          FormName: t.dataValues.Form.dataValues.Name,
          FormTypeId: formTypeId,
          IsRejected: t.dataValues.Form.dataValues.IsRejected,
          FormType: t.dataValues.Form.FormType.dataValues.Name,
          IsConfirmed: confirmed,
          UserFormId: t.dataValues.Id,
        };
      });
      if (list[0].FormTypeId !== 5) {
        await UserForm.update(
          { Value: JSON.stringify(list[0].Value) },
          { where: { Id: list[0].UserFormId } }
        );
      }
    } else if (user.role == 1) {
      list = await UserForm.findAll({
        include: {
          model: Form,
          include: {
            model: FormType,
            attributes: ["Name"],
            required: true,
          },
          where: { UniqueKey: formUniqueKey },
          attributes: ["FormTypeId", "Name", "IsRejected"],
          required: true,
        },
        attributes: [
          "HeadId",
          "DeanId",
          "CoordinatorId",
          "StakeholderId",
          "GraderId",
          "Value",
        ],
      }).map((t) => {
        if(t.dataValues.Form.dataValues.FormTypeId == "5"){
          return {
            HeadId: t.dataValues.HeadId,
            DeanId: t.dataValues.DeanId,
            CoordinatorId: t.dataValues.CoordinatorId,
            StakeholderId: t.dataValues.StakeholderId,
            GraderId: t.dataValues.GraderId,
            Value: t.dataValues.Value,
            FormName: t.dataValues.Form.dataValues.Name,
            FormTypeId: t.dataValues.Form.dataValues.FormTypeId,
            IsRejected: t.dataValues.Form.dataValues.IsRejected,
            FormType: t.dataValues.Form.FormType.dataValues.Name,
            UserFormId: t.dataValues.Id,
          };
        }else{
          return {
            HeadId: t.dataValues.HeadId,
            DeanId: t.dataValues.DeanId,
            CoordinatorId: t.dataValues.CoordinatorId,
            StakeholderId: t.dataValues.StakeholderId,
            GraderId: t.dataValues.GraderId,
            Value: JSON.parse(t.dataValues.Value),
            FormName: t.dataValues.Form.dataValues.Name,
            FormTypeId: t.dataValues.Form.dataValues.FormTypeId,
            IsRejected: t.dataValues.Form.dataValues.IsRejected,
            FormType: t.dataValues.Form.FormType.dataValues.Name,
          };
        }
        
      });
    } else {
      list = await UserForm.findAll({
        include: {
          model: Form,
          include: {
            model: FormType,
            attributes: ["Name"],
            required: true,
          },
          where: { UniqueKey: formUniqueKey },
          attributes: ["FormTypeId", "Name", "IsRejected"],
          required: true,
        },
        attributes: [
          "HeadId",
          "DeanId",
          "CoordinatorId",
          "StakeholderId",
          "GraderId",
          "Value",
        ],
      }).map((t) => {
        let confirmed = false;
        if (user.role == 2 && t.dataValues.DeanId) {
          confirmed = true;
        } else if (user.role == 3 && t.dataValues.HeadId) {
          confirmed = true;
        } else if (user.role == 4 && t.dataValues.CoordinatorId) {
          confirmed = true;
        } else if (user.role == 5 && t.dataValues.GraderId) {
          confirmed = true;
        } else if (user.role == 6 && t.dataValues.StakeholderId) {
          confirmed = true;
        }
        return {
          HeadId: t.dataValues.HeadId,
          DeanId: t.dataValues.DeanId,
          CoordinatorId: t.dataValues.CoordinatorId,
          StakeholderId: t.dataValues.StakeholderId,
          GraderId: t.dataValues.GraderId,
          Value: JSON.parse(t.dataValues.Value),
          FormName: t.dataValues.Form.dataValues.Name,
          FormTypeId: t.dataValues.Form.dataValues.FormTypeId,
          IsRejected: t.dataValues.Form.dataValues.IsRejected,
          FormType: t.dataValues.Form.FormType.dataValues.Name,
          IsConfirmed: confirmed,
        };
      });
    }
  }
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  if (list[0].FormTypeId == 5) {
    console.log("list[0]:", list[0]);
    var data = fs.readFileSync(list[0].Value);
    res.contentType("application/pdf");
    res.send({
      message: "Form Detail Responsed Successfully",
      ok: true,
      pdf: data,
      list,
    });
  } else {
    res.status(200).send({
      message: "Form Detail Responsed Successfully",
      ok: true,
      list,
    });
  }
};

module.exports = {
  handler,
};
