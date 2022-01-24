const readXlsxFile = require("read-excel-file/node");
var fs = require("fs");
const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");

const handler = async (req, res) => {
  const { User, UserRole, Stakeholder, UserStakeholder, StakeholderCompany } =
    await connectToDatabase();
  const model = req.body;
  console.log("model:", model);
  const isExist = await User.findOne({
    where: { Email: model.email, IsDeleted: false },
  });
  if (isExist) {
    //* Checks for user role
    const userRole = await UserRole.findOne({
      where: { UserId: isExist.Id },
    });
    try {
      //* Deletes From User Table
      await User.update(
        {
          IsDeleted: true,
        },
        {
          where: {
            Id: isExist.Id,
          },
        }
      );
      //* Deletes From User Table
      await UserRole.destroy({
        where: {
          UserId: isExist.Id,
        },
      });
      //* Checks if user's role is student
      if (userRole.RoleId == 1) {
        //* Deteles from UserStakeholder table
        await UserStakeholder.destroy({
          where: {
            UserId: isExist.Id,
          },
        });
      } else if (userRole.RoleId == 6) {
        //* Checks if user's role is stakeholder
        //* Deletes from Stakeholder Table
        const stakeholder = await Stakeholder.findOne({
          where: {
            Email: isExist.Email,
            IsDeleted: false,
          },
        });
        await Stakeholder.update(
          {
            IsDeleted: true,
          },
          {
            where: {
              Email: isExist.Email,
            },
          }
        );
        //* Delete From User UserStakeholder
        await UserStakeholder.destroy({
          where: {
            StakeholderId: stakeholder.Id,
          },
        });
        //* Delete From User UserStakeholder
        await StakeholderCompany.destroy({
          where: {
            StakeholderId: stakeholder.Id,
          },
        });
      }
      // Responds to client
      res.status(200).send({
        message: "User deleted successfully",
        data: { ok: true, ok: true },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "User could not deleted!",
        data: { ok: false },
      });
    }
  } else {
    res.status(400).send({
      message: "User cannot found!",
      data: { ok: false },
    });
  }
};
module.exports = {
  handler,
};
