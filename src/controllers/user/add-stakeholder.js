const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");
var nodemailer = require("nodemailer");

const register = async (req, res) => {
  const {
    User,
    UserRole,
    Stakeholder,
    StakeholderCompany,
    Company,
    UserStakeholder,
  } = await connectToDatabase();
  const model = req.body;
  const usercode = req.params.usercode;
  //* Checks if the user exist
  const isExist = await User.findOne({
    where: { Email: model.email, IsDeleted: false },
  });
  if (isExist) {
    //! If email used, send error
    res.status(400).send({
      message: "This Email is already in use!",
      data: { ok: false },
    });
  } else {
    try {
      //* Creates new User with given parameter
      const userResult = await User.create({
        UniqueKey: uuid(),
        Name: model.name,
        Surname: model.surname,
        SchoolId: "",
        Password: md5(uuid()),
        Email: model.email,
      });
      //* Creates new UserRole as Stakeholder
      const userRoleResult = await UserRole.create({
        UserId: userResult.dataValues.Id,
        RoleId: 6,
      });
      //* Creates a new Stakeholder
      const stakeholderResult = await Stakeholder.create({
        Fullname: model.name + " " + model.surname,
        Email: model.email,
      });
      // console.log("after stakeholder creation");
      // //* Checks if the Comapny exist
      // const isCompanyExist = await Company.findOne({
      //   where: { Name: model.companyName, IsDeleted: false },
      // });
      // console.log("after control company exist");
      // if (isCompanyExist) {
      //   //* Connect Stakeholder with company which is recorded already
      //   const stakeholderCompanyResult = await StakeholderCompany.create({
      //     CompanyId: isCompanyExist.Id,
      //     StakeholderId: stakeholderResult.dataValues.Id,
      //   });
      // } else {
      //   console.log("deneme else ici");
      //   //* Create a New Company
      //   const companyResult = await Company.create({
      //     UniqueKey: uuid(),
      //     Name: model.companyName,
      //   });
      //   console.log("buraya geldi");
      //   //* Connect Stakeholder with company which is created new
      //   const stakeholderCompanyResult = await StakeholderCompany.create({
      //     CompanyId: companyResult.dataValues.Id,
      //     StakeholderId: stakeholderResult.dataValues.Id,
      //   });
      //   console.log("buraya da geldi");
      //   //* Connect the Stakeholder with User
      //   const isUserExist = await User.findOne({
      //     where: { UniqueKey: usercode, IsDeleted: false },
      //   });
      //   if (!isUserExist) {
      //     res.status(400).send({
      //       message: "User Not Found",
      //       data: { ok: false },
      //     });
      //   }
      //   const userStakeholderResult = await UserStakeholder.create({
      //     UserId: isUserExist.Id,
      //     StakeholderId: stakeholderResult.dataValues.Id,
      //   });
      // }
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
        subject: "Tebrikler",
        text:
          "Burada ki bağlantıyı kullanarak şifrenizi oluşturabilirsiniz http://localhost:3000/user/stakeholder/" +
          userResult.dataValues.UniqueKey,
      };
      //* Sends email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      //* Success
      res.status(200).send({
        message: "Email sent successfully",
        data: { ok: true },
      });
    } catch (error) {
      //! Error
      res.status(400).send({
        message: "[ADD STAKEHOLDER ERROR]",
        error,
        data: { error: error.message },
      });
    }
  }
};

// const model = {
//   uniqueKey: key,
//   password: password,
//   passwordApprove: passwordConfirm,
//   jobTitle,
//   companyName,
//   companyAddress,
//   companySector,
//   companyPhone,
//   companyFax,
//   companyEmail,
//   companyWebsite,
//   companyEmployeeNumber,
//   companyControl,
// };

const registerComplete = async (req, res) => {
  const { User, Stakeholder, Company, StakeholderCompany } =
    await connectToDatabase();
  const model = req.body;
  //* Checks if the user exist
  if (model.password !== model.passwordApprove) {
    //! Error
    res.status(400).send({
      message: "[REGISTER COMPLETE STAKEHOLDER ERROR]",
      data: { error: "password do not match!", ok: false },
    });
  }
  const isExist = await User.findOne({
    where: { UniqueKey: model.uniqueKey, IsDeleted: false },
  });
  if (isExist) {
    //* Checks if the passwords are equeal
    //* Update User Password
    await User.update(
      { Password: md5(model.password) },
      { where: { Id: isExist.Id } }
    );
    const stakeholderResult = await Stakeholder.findOne({
      where: { Email: isExist.Email, IsDeleted: false },
    });
    await Stakeholder.update(
      { IsConfirmed: true, Title: model.jobTitle },
      { where: { Email: isExist.Email } }
    );
    if (model.companyControl) {
      const stakeholderCompany = await Company.findOne({
        where: { Name: model.companyName, IsDeleted: false },
      });
      if (stakeholderCompany) {
        const stakeholderCompanyResult = await StakeholderCompany.create({
          CompanyId: stakeholderCompany.dataValues.Id,
          StakeholderId: stakeholderResult.dataValues.Id,
        });
      } else {
        //! Error
        res.status(400).send({
          message: "[REGISTER COMPLETE STAKEHOLDER ERROR]",
          data: { error: "company not found!", ok: false },
        });
      }
    } else {
      const companyResult = await Company.create({
        UniqueKey: uuid(),
        Name: model.companyName,
        Address: model.companyAddress,
        Sector: model.companySector,
        PhoneNo: model.companyPhone,
        FaxNo: model.companyFax,
        Email: model.companyEmail,
        WebAddress: model.companyWebsite,
        CompanyEmployeeNo: model.companyEmployeeNumber,
      });
      const stakeholderCompanyResult = await StakeholderCompany.create({
        CompanyId: companyResult.dataValues.Id,
        StakeholderId: stakeholderResult.dataValues.Id,
      });
    }
    //* Return success result
    res.status(200).send({
      message: "Password approved",
      data: { ok: true },
    });
  } else {
    //! Error
    res.status(400).send({
      message: "[REGISTER COMPLETE CONTROLLER]",
      data: { ok: false, error: "USER NOT FOUND!" },
    });
  }
};

const list = async (req, res) => {
  const { User, Stakeholder, StakeholderCompany, Company, UserStakeholder } =
    await connectToDatabase();
  const usercode = req.params.usercode;
  //* Checks if the user exist
  const isExist = await User.findOne({
    where: { UniqueKey: usercode, IsDeleted: false },
  });
  if (!isExist) {
    //! If email used, send error
    res.status(400).send({
      message: "User Not Found!",
      data: { ok: false },
    });
  } else {
    const currentStakeholder = await UserStakeholder.findAll({
      where: { UserId: isExist.Id },
      include: [
        {
          model: Stakeholder,
          attributes: ["Fullname", "Title"],
          include: {
            model: StakeholderCompany,
            include: {
              model: Company,
              attributes: ["Name"],
            },
          },
        },
      ],
    }).map((t) => {
      const fullname = t.dataValues.Stakeholder.Fullname;
      const title = t.dataValues.Stakeholder.Title;
      const companyName =
        t.dataValues.Stakeholder.StakeholderCompanies[0].dataValues.Company
          .dataValues.Name;
      const response = companyName + " (" + fullname + ")";
      return {
        fullname: response,
      };
    });
    console.log("Current stakeholder geldi: ", currentStakeholder);
    // console.log("Current stakeholder geldi: ",currentStakeholder.dataValues.Stakeholder.StakeholderCompanies[0].dataValues.Company.dataValues.Name);
    console.log("---------------------------------");

    const stakeholders = await Stakeholder.findAll({
      where: { IsDeleted: false, IsConfirmed: true },
      attributes: ["Id","Fullname","Title", "Email"],
      include: [
        {
          model: StakeholderCompany,
          include: {
            model: Company,
            attributes: [
              "Name",
              "Address",
              "Sector",
              "PhoneNo",
              "FaxNo",
              "Email",
              "WebAddress",
              "CompanyEmployeeNo",
            ],
          },
        },
      ],
    }).map((t) => {
      console.log("bak buraya:", t.dataValues);
      const id = t.dataValues.Id;
      const fullname = t.dataValues.Fullname;
      const title = t.dataValues.Title;
      const email = t.dataValues.Email;
      const companyName =t.dataValues.StakeholderCompanies[0].dataValues.Company.Name
      const companyAddress =t.dataValues.StakeholderCompanies[0].dataValues.Company.Address;
      const companySector =t.dataValues.StakeholderCompanies[0].dataValues.Company.Sector;
      const companyPhoneNo =t.dataValues.StakeholderCompanies[0].dataValues.Company.PhoneNo;
      const companyFaxNo =t.dataValues.StakeholderCompanies[0].dataValues.Company.FaxNo;
      const companyEmail =t.dataValues.StakeholderCompanies[0].dataValues.Company.Email;
      const companyWebAddress =t.dataValues.StakeholderCompanies[0].dataValues.Company.WebAddress;
      const companyCompanyEmployeeNo =t.dataValues.StakeholderCompanies[0].dataValues.Company.CompanyEmployeeNo;
      const response = companyName + " (" + fullname + ")";

      return {
        id,
        fullname: response,
        email: t.dataValues.Email,
        companyName,
        companyAddress,
        companySector,
        companyPhoneNo,
        companyFaxNo,
        companyEmail,
        companyWebAddress,
        companyCompanyEmployeeNo,
        companyEmployeeName: fullname,
        title,
        email
      };
    });
    res.status(200).send({
      message: "List returned successfully",
      data: { ok: true, data: stakeholders, currentStakeholder },
    });
  }
};

const update = async (req, res) => {
  const {
    User,
    UserRole,
    Stakeholder,
    StakeholderCompany,
    Company,
    UserStakeholder,
  } = await connectToDatabase();
  const model = req.body;
  const usercode = req.params.usercode;
  //* Checks if the user exist
  const isUserExist = await User.findOne({
    where: { UniqueKey: usercode, IsDeleted: false },
  });
  const isStakeholderExist = await Stakeholder.findOne({
    where: { Email: model.email, IsDeleted: false },
  });
  if (!isUserExist || !isStakeholderExist) {
    //! If email used, send error
    res.status(400).send({
      message: "User Not Found!",
      data: { ok: false },
    });
  } else {
    //* Deletes old stakeholder connected with user
    const oldStakeholders = await UserStakeholder.destroy({
      where: { UserId: isUserExist.Id },
    });
    //* Connects new stakeholder with user
    const newStakeholder = await UserStakeholder.create({
      UserId: isUserExist.Id,
      StakeholderId: isStakeholderExist.Id,
    });
    res.status(200).send({
      message: "Stakeholder Updated Successfully",
      data: { ok: true },
    });
  }
};

module.exports = {
  register,
  registerComplete,
  list,
  update,
};
