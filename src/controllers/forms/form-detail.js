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
    list = await UserForm.findAll({
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name"],
          required: true,
        },
        where: { UniqueKey: formUniqueKey },
        attributes: ["Name"],
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
      return {
        HeadId: t.dataValues.HeadId,
        DeanId: t.dataValues.DeanId,
        CoordinatorId: t.dataValues.CoordinatorId,
        StakeholderId: t.dataValues.StakeholderId,
        GraderId: t.dataValues.GraderId,
        Value: JSON.parse(t.dataValues.Value),
        FormName: t.dataValues.Form.dataValues.Name,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
      };
    });
  }
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.status(200).send({
    message: "Form Detail Responsed Successfully",
    ok: true,
    list,
  });
};

module.exports = {
  handler,
};
