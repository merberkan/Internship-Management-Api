const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const moment = require('moment');

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
  const usercode = req.params.usercode;
  const model = req.body;
  let list;
  // gelen user: {
  //   usercode: '3e2975fa7b5241849ae88da8773cc1c9',
  //   fullName: 'Mert BerkanAkdeniz',
  //   email: 'mert.akdeniz@isik.edu.tr',
  //   role: 1,
  //   iat: 1641836483
  // }
  //   "1", "Student_Role", "1";
  //   "2", "Dean_Role", "0";
  //   "3", "Head_Role", "0";
  //   "4", "Coordinator_Role", "0";
  //   "5", "Grader_Role", "0";
  //   "6", "Stakeholder_Role", "0";
  const userData = await User.findOne({
    where: { IsDeleted: false, UniqueKey: usercode },
    include: {
      model: UserRole,
      attributes: ["RoleId"],
    },
  });
  const role = userData.UserRoles[0].dataValues.RoleId;
  if (role == 1) {
    list = await UserForm.findAll({
      where: { StudentId: userData.Id },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name"],
          required: true,
        },
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
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
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
  } else if (role == 2) {
    list = await UserForm.findAll({
      where: {
        HeadId: {
          [Op.not]: null, // Like: HeadId IS NOT NULL
        },
      },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name"],
          required: true,
        },
        where: {
          IsApproved: false,
          IsRejected: {
            [Op.not]: true, // Like: sellDate IS NOT NULL
          },
        },
        attributes: ["UniqueKey", "Name", "InsertedDate"],
        required: true,
      },
      attributes: ["HeadId"],
    }).map((t) => {
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('YYYY/MM/DD'),
      };
    });
  } else if (role == 3) {
    list = await UserForm.findAll({
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name"],
          required: true,
        },
        where: {
          IsApproved: false,
          DepartmentId: userData.DepartmentId,
          IsRejected: {
            [Op.not]: true, // Like: sellDate IS NOT NULL
          },
        },
        attributes: ["UniqueKey", "Name", "InsertedDate"],
        required: true,
      },
      attributes: ["HeadId"],
    }).map((t) => {
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('YYYY/MM/DD'),
      };
    });
  } else if (role == 4) {
    list = await UserForm.findAll({
      where: {
        HeadId: {
          [Op.not]: null, // Like: HeadId IS NOT NULL
        },
        DeanId: {
          [Op.not]: null, // Like: DeanId IS NOT NULL
        },
      },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name"],
          required: true,
        },
        where: {
          IsApproved: false,
          IsRejected: {
            [Op.not]: true, // Like: sellDate IS NOT NULL
          },
        },
        attributes: ["UniqueKey", "Name", "InsertedDate"],
        required: true,
      },
      attributes: ["HeadId"],
    }).map((t) => {
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('YYYY/MM/DD'),
      };
    });
  } else if (role == 5) {
  } else {
    list = await UserForm.findAll({
      where: { StudentId: userData.Id },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name"],
          required: true,
        },
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
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
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
  res.status(200).send({
    message: "Form Created Successfully",
    ok: true,
    list,
  });
};

module.exports = {
  handler,
};
