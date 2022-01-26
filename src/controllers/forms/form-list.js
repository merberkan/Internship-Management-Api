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
      let rejectReason = "Onay Sürecinde"
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        if(formTypeId == 1 || formTypeId == 2){
          if(!stakeholder && !dean && !head && !coordinator){
            formStatus = "Paydaş Onayı Bekleniyor";
          }else if(stakeholder && !dean && !head && !coordinator){
            formStatus = "Bölüm Başkanı Onayı Bekleniyor";
          }else if(stakeholder && !dean && head && !coordinator){
            formStatus = "Dekanlık Onayı Bekleniyor";
          }else if(stakeholder && dean && head && !coordinator){
            formStatus = "Staj Koordinatörlüğü Onayı Bekleniyor";
          }
        }else if(formTypeId == 3 || formTypeId == 4){
          if(!dean && !head && !coordinator){
            formStatus = "Bölüm Başkanı Onayı Bekleniyor";
          }else if(!dean && head && !coordinator){
            formStatus = "Dekanlık Onayı Bekleniyor";
          }else if(dean && head && !coordinator){
            formStatus = "Staj Koordinatörlüğü Onayı Bekleniyor";
          }
        }else{
          if(!stakeholder && !grader){
            formStatus = "Paydaş Onayı Bekleniyor";
          }else if(stakeholder && !grader){
            formStatus = "Asistan Onayı Bekleniyor";
          }
        }
      }else if(t.dataValues.Form.dataValues.IsApproved){
        formStatus= "Onaylandı"
      }else{
        formStatus = "Reddedildi"
      }
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Onay Sürecinde"
        rejectReason = "Onay Sürecinde"
      }else if(t.dataValues.Form.dataValues.IsApproved){
        approveStatus = "Onaylandı"
        rejectReason = "Onaylandı"
      }else if(t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Reddedildi"
        rejectReason = t.dataValues.Form.dataValues.RejectReason
      }
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        IsApproved:t.dataValues.Form.dataValues.IsApproved ? "Onaylandı":"Onay Sürecinde",
        IsRejected:t.dataValues.Form.dataValues.IsRejected ? "Reddedildi":"Onay Sürecinde",
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: formTypeId,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('DD/MM/YYYY'),
        FormStatus:formStatus,
        ApproveStatus: approveStatus,
        RejectReason: rejectReason
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
      attributes: ["HeadId"],
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
      let rejectReason = "Onay Sürecinde"
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        if(formTypeId == 1 || formTypeId == 2){
          if(!stakeholder && !dean && !head && !coordinator){
            formStatus = "Paydaş Onayı Bekleniyor";
          }else if(stakeholder && !dean && !head && !coordinator){
            formStatus = "Bölüm Başkanı Onayı Bekleniyor";
          }else if(stakeholder && !dean && head && !coordinator){
            formStatus = "Dekanlık Onayı Bekleniyor";
          }else if(stakeholder && dean && head && !coordinator){
            formStatus = "Staj Koordinatörlüğü Onayı Bekleniyor";
          }
        }else if(formTypeId == 3 || formTypeId == 4){
          if(!dean && !head && !coordinator){
            formStatus = "Bölüm Başkanı Onayı Bekleniyor";
          }else if(!dean && head && !coordinator){
            formStatus = "Dekanlık Onayı Bekleniyor";
          }else if(dean && head && !coordinator){
            formStatus = "Staj Koordinatörlüğü Onayı Bekleniyor";
          }
        }else{
          if(!stakeholder && !grader){
            formStatus = "Paydaş Onayı Bekleniyor";
          }else if(stakeholder && !grader){
            formStatus = "Asistan Onayı Bekleniyor";
          }
        }
      }else if(t.dataValues.Form.dataValues.IsApproved){
        formStatus= "Onaylandı"
      }else{
        formStatus = "Reddedildi"
      }
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Onay Sürecinde"
        rejectReason = "Onay Sürecinde"
      }else if(t.dataValues.Form.dataValues.IsApproved){
        approveStatus = "Onaylandı"
        rejectReason = "Onaylandı"
      }else if(t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Reddedildi"
        rejectReason = t.dataValues.Form.dataValues.RejectReason
      }
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        IsApproved:t.dataValues.Form.dataValues.IsApproved ? "Onaylandı":"Onay Sürecinde",
        IsRejected:t.dataValues.Form.dataValues.IsRejected ? "Reddedildi":"Onay Sürecinde",
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: formTypeId,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('DD/MM/YYYY'),
        FormStatus:formStatus,
        ApproveStatus: approveStatus,
        RejectReason: rejectReason
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
      attributes: ["HeadId"],
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
      let rejectReason = "Onay Sürecinde"
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        if(formTypeId == 1 || formTypeId == 2){
          if(!stakeholder && !dean && !head && !coordinator){
            formStatus = "Paydaş Onayı Bekleniyor";
          }else if(stakeholder && !dean && !head && !coordinator){
            formStatus = "Bölüm Başkanı Onayı Bekleniyor";
          }else if(stakeholder && !dean && head && !coordinator){
            formStatus = "Dekanlık Onayı Bekleniyor";
          }else if(stakeholder && dean && head && !coordinator){
            formStatus = "Staj Koordinatörlüğü Onayı Bekleniyor";
          }
        }else if(formTypeId == 3 || formTypeId == 4){
          if(!dean && !head && !coordinator){
            formStatus = "Bölüm Başkanı Onayı Bekleniyor";
          }else if(!dean && head && !coordinator){
            formStatus = "Dekanlık Onayı Bekleniyor";
          }else if(dean && head && !coordinator){
            formStatus = "Staj Koordinatörlüğü Onayı Bekleniyor";
          }
        }else{
          if(!stakeholder && !grader){
            formStatus = "Paydaş Onayı Bekleniyor";
          }else if(stakeholder && !grader){
            formStatus = "Asistan Onayı Bekleniyor";
          }
        }
      }else if(t.dataValues.Form.dataValues.IsApproved){
        formStatus= "Onaylandı"
      }else{
        formStatus = "Reddedildi"
      }
      if(!t.dataValues.Form.dataValues.IsApproved && !t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Onay Sürecinde"
        rejectReason = "Onay Sürecinde"
      }else if(t.dataValues.Form.dataValues.IsApproved){
        approveStatus = "Onaylandı"
        rejectReason = "Onaylandı"
      }else if(t.dataValues.Form.dataValues.IsRejected){
        approveStatus = "Reddedildi"
        rejectReason = t.dataValues.Form.dataValues.RejectReason
      }
      return {
        id: t.dataValues.Form.dataValues.UniqueKey,
        FormName: t.dataValues.Form.dataValues.Name,
        IsApproved:t.dataValues.Form.dataValues.IsApproved ? "Onaylandı":"Onay Sürecinde",
        IsRejected:t.dataValues.Form.dataValues.IsRejected ? "Reddedildi":"Onay Sürecinde",
        LessonCode: t.dataValues.Form.dataValues.LessonCode,
        FormType: t.dataValues.Form.FormType.dataValues.Name,
        FormTypeId: formTypeId,
        InsertedDate: moment(t.dataValues.Form.dataValues.InsertedDate).utc().format('DD/MM/YYYY'),
        FormStatus:formStatus,
        ApproveStatus: approveStatus,
        RejectReason: rejectReason
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
