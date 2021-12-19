const readXlsxFile = require("read-excel-file/node");
var fs = require("fs");
const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");

const handler = async (req, res) => {
  const { User, UserRole } = await connectToDatabase();
  const model = req.body;
  const isExist = await User.findOne({
    where: { UniqueKey: model.uniqueKey },
  });
  if (isExist) {
    try {
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
      await UserRole.destroy({
        where: {
          UserId: isExist.Id,
        },
      });
      // Responds to client
      res.status(200).send({
        message: "User deleted successfully",
        data: { isSuccess: true },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "User could not deleted!",
        data: { isSuccess: false },
      });
    }
  }else{
    res.status(400).send({
        message: "User cannot found!",
        data: { isSuccess: false },
      });
  }
};
module.exports = {
  handler,
};
