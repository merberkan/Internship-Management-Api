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
      where: {
        StudentId: userData.Id
      },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name","Id"],
          required: true,
        },
        attributes: ["UniqueKey", "Name", "InsertedDate","LessonCode","IsApproved","IsRejected","RejectReason"],
        required: true,
      },
      attributes: ["HeadId","DeanId","CoordinatorId","StakeholderId","GraderId"],
    }).map((t) => {
      let formStatus="";
      let stakeholder = t.dataValues.StakeholderId;
      let dean = t.dataValues.DeanId;
      let head = t.dataValues.HeadId;
      let coordinator = t.dataValues.CoordinatorId;
      let grader = t.dataValues.GraderId;
      let formTypeId = t.dataValues.Form.FormType.dataValues.Id;
      let approveStatus = "";
      let rejectReason = "In the Approval Process"
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        if(formTypeId == 1 || formTypeId == 2){
          if(!stakeholder && !dean && !head && !coordinator){
            formStatus = "Waiting for Stakeholder Approval";
          }else if(stakeholder && !dean && !head && !coordinator){
            formStatus = "Waiting for The Head of the Department Approval";
          }else if(stakeholder && !dean && head && !coordinator){
            formStatus = "Waiting for Dean's Approval";
          }else if(stakeholder && dean && head && !coordinator){
            formStatus = "Waiting for Internship Coordinator Approval";
          }
        }else if(formTypeId == 3 || formTypeId == 4){
          if(!dean && !head && !coordinator){
            formStatus = "Waiting for The Head of the Department Approval";
          }else if(!dean && head && !coordinator){
            formStatus = "Waiting for Dean's Approval";
          }else if(dean && head && !coordinator){
            formStatus = "Waiting for Internship Coordinator Approval";
          }
        }else{
          if(!stakeholder && !grader){
            formStatus = "Waiting for Stakeholder Approval";
          }else if(stakeholder && !grader){
            formStatus = "Waiting for Grader Approval";
          }
        }
      }else if(t.dataValues.Form.dataValues.IsApproved){
        formStatus= "Approved"
      }else{
        formStatus = "Rejected"
      }
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "In the Approval Process"
        rejectReason = "In the Approval Process"
      }else if(t.dataValues.Form.dataValues.IsApproved){
        approveStatus = "Approved"
        rejectReason = "Approved"
      }else if(t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Rejected"
        rejectReason = t.dataValues.Form.dataValues.RejectReason
      }
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        IsApproved:t.dataValues.Form.dataValues.IsApproved ? "Approved":"In the Approval Process",
        IsRejected:t.dataValues.Form.dataValues.IsRejected ? "Rejected":"In the Approval Process",
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: formTypeId,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('DD/MM/YYYY'),
        FormStatus:formStatus,
        ApproveStatus: approveStatus,
        RejectReason: rejectReason,
      };
    });
    console.log("returned list:",list)
  } else if (role == 2) {
    list = await UserForm.findAll({
      where: {
        HeadId: {
          [Op.not]: null, // Like: HeadId IS NOT NULL
        },
        DeanId: null,
      },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name","Id"],
          required: true,
        },
        where: {
          IsApproved: false,
          FormTypeId: {
            [Op.notIn]: [5,6]
          },
          IsRejected: {
            [Op.not]: true, // Like: sellDate IS NOT NULL
          },
        },
        attributes: ["UniqueKey", "Name", "InsertedDate","LessonCode"],
        required: true,
      },
      attributes: ["HeadId","SendedEmail"],
    }).map((t) => {
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormTypeId: t.dataValues.Form.FormType.dataValues.Id,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('YYYY/MM/DD'),
        SendedEmail: t.dataValues.SendedEmail
      };
    });
  } else if (role == 3) {
    list = await UserForm.findAll({
      where: {
        StakeholderId: {
          [Op.not]: null, // Like: StakeholderId IS NOT NULL
        },
      },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name","Id"],
          required: true,
        },
        where: {
          DepartmentId: userData.DepartmentId,
          FormTypeId: {
            [Op.notIn]: [5,6]
          }
        },
        attributes: ["UniqueKey", "Name", "InsertedDate","LessonCode","IsApproved","IsRejected","RejectReason"],
        required: true,
      },
      attributes: ["HeadId","DeanId","CoordinatorId","StakeholderId","GraderId","SendedEmail"],
    }).map((t) => {
      let formStatus="";
      let stakeholder = t.dataValues.StakeholderId;
      let dean = t.dataValues.DeanId;
      let head = t.dataValues.HeadId;
      let coordinator = t.dataValues.CoordinatorId;
      let grader = t.dataValues.GraderId;
      let formTypeId = t.dataValues.Form.FormType.dataValues.Id;
      let approveStatus = "";
      let rejectReason = "In the Approval Process"
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        if(formTypeId == 1 || formTypeId == 2){
          if(!stakeholder && !dean && !head && !coordinator){
            formStatus = "Waiting for Stakeholder Approval";
          }else if(stakeholder && !dean && !head && !coordinator){
            formStatus = "Waiting for The Head of the Department Approval";
          }else if(stakeholder && !dean && head && !coordinator){
            formStatus = "Waiting for Dean's Approval";
          }else if(stakeholder && dean && head && !coordinator){
            formStatus = "Waiting for Internship Coordinator Approval";
          }
        }else if(formTypeId == 3 || formTypeId == 4){
          if(!dean && !head && !coordinator){
            formStatus = "Waiting for The Head of the Department Approval";
          }else if(!dean && head && !coordinator){
            formStatus = "Waiting for Dean's Approval";
          }else if(dean && head && !coordinator){
            formStatus = "Waiting for Internship Coordinator Approval";
          }
        }else{
          if(!stakeholder && !grader){
            formStatus = "Waiting for Stakeholder Approval";
          }else if(stakeholder && !grader){
            formStatus = "Waiting for Grader Approval";
          }
        }
      }else if(t.dataValues.Form.dataValues.IsApproved){
        formStatus= "Approved"
      }else{
        formStatus = "Rejected"
      }
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "In the Approval Process"
        rejectReason = "In the Approval Process"
      }else if(t.dataValues.Form.dataValues.IsApproved){
        approveStatus = "Approved"
        rejectReason = "Approved"
      }else if(t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Rejected"
        rejectReason = t.dataValues.Form.dataValues.RejectReason
      }
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        IsApproved:t.dataValues.Form.dataValues.IsApproved ? "Approved":"In the Approval Process",
        IsRejected:t.dataValues.Form.dataValues.IsRejected ? "Rejected":"In the Approval Process",
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: formTypeId,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('DD/MM/YYYY'),
        FormStatus:formStatus,
        ApproveStatus: approveStatus,
        RejectReason: rejectReason,
        SendedEmail: t.dataValues.SendedEmail
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
          attributes: ["Name","Id"],
          required: true,
        },
        where: {
          FormTypeId: {
            [Op.notIn]: [5,6]
          },
        },
        attributes: ["UniqueKey", "Name", "InsertedDate","LessonCode"],
        required: true,
      },
      attributes: ["HeadId","SendedEmail"],
    }).map((t) => {
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormTypeId: t.dataValues.Form.FormType.dataValues.Id,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('YYYY/MM/DD'),
        SendedEmail: t.dataValues.SendedEmail
      };
    });
  } else if (role == 5) {
    list = await UserForm.findAll({
      where: {
        StakeholderId: {
          [Op.not]: null, // Like: StakeholderId IS NOT NULL
        },
      },
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name","Id"],
          required: true,
        },
        where: {
          DepartmentId: userData.DepartmentId,
          FormTypeId: {
            [Op.notIn]: [1,2,3,4]
          }
        },
        attributes: ["UniqueKey", "Name", "InsertedDate","LessonCode","IsApproved","IsRejected","RejectReason"],
        required: true,
      },
      attributes: ["HeadId","DeanId","CoordinatorId","StakeholderId","GraderId","SendedEmail"],
    }).map((t) => {
      let formStatus="";
      let stakeholder = t.dataValues.StakeholderId;
      let dean = t.dataValues.DeanId;
      let head = t.dataValues.HeadId;
      let coordinator = t.dataValues.CoordinatorId;
      let grader = t.dataValues.GraderId;
      let formTypeId = t.dataValues.Form.FormType.dataValues.Id;
      let approveStatus = "";
      let rejectReason = "In the Approval Process"
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        if(formTypeId == 1 || formTypeId == 2){
          if(!stakeholder && !dean && !head && !coordinator){
            formStatus = "Waiting for Stakeholder Approval";
          }else if(stakeholder && !dean && !head && !coordinator){
            formStatus = "Waiting for The Head of the Department Approval";
          }else if(stakeholder && !dean && head && !coordinator){
            formStatus = "Waiting for Dean's Approval";
          }else if(stakeholder && dean && head && !coordinator){
            formStatus = "Waiting for Internship Coordinator Approval";
          }
        }else if(formTypeId == 3 || formTypeId == 4){
          if(!dean && !head && !coordinator){
            formStatus = "Waiting for The Head of the Department Approval";
          }else if(!dean && head && !coordinator){
            formStatus = "Waiting for Dean's Approval";
          }else if(dean && head && !coordinator){
            formStatus = "Waiting for Internship Coordinator Approval";
          }
        }else{
          if(!stakeholder && !grader){
            formStatus = "Waiting for Stakeholder Approval";
          }else if(stakeholder && !grader){
            formStatus = "Waiting for Grader Approval";
          }
        }
      }else if(t.dataValues.Form.dataValues.IsApproved){
        formStatus= "Approved"
      }else{
        formStatus = "Rejected"
      }
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "In the Approval Process"
        rejectReason = "In the Approval Process"
      }else if(t.dataValues.Form.dataValues.IsApproved){
        approveStatus = "Approved"
        rejectReason = "Approved"
      }else if(t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Rejected"
        rejectReason = t.dataValues.Form.dataValues.RejectReason
      }
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        IsApproved:t.dataValues.Form.dataValues.IsApproved ? "Approved":"In the Approval Process",
        IsRejected:t.dataValues.Form.dataValues.IsRejected ? "Rejected":"In the Approval Process",
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: formTypeId,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('DD/MM/YYYY'),
        FormStatus:formStatus,
        ApproveStatus: approveStatus,
        RejectReason: rejectReason,
        SendedEmail: t.dataValues.SendedEmail
      };
    });
  } else {
    list = await UserForm.findAll({
      where: {SendedEmail: userData.Email},
      include: {
        model: Form,
        include: {
          model: FormType,
          attributes: ["Name","Id"],
          required: true,
        },
        where: {
          IsApproved: false,
          IsRejected: {
            [Op.not]: true, // Like: sellDate IS NOT NULL
          },
        },
        attributes: ["UniqueKey", "Name", "InsertedDate","LessonCode"],
        required: true,
      },
      attributes: ["HeadId"],
    }).map((t) => {
      console.log(t.dataValues.Form.FormType.dataValues.Name);
      console.log("-------------------------------------");
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: t.dataValues.Form.FormType.dataValues.Id,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('YYYY/MM/DD'),
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
