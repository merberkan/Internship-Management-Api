const readXlsxFile = require("read-excel-file/node");
var fs = require("fs");
const connectToDatabase = require("../../lib/database");
const { uuid } = require("../../helpers/utils");
const md5 = require("md5");

const handler = async (req, res) => {
  const { User, UserRole } = await connectToDatabase();
  const model = req.body;
  let isPasswordConfirmed = false;
  let isPasswordEmpty = false;
  const isExist = await User.findOne({
    where: { UniqueKey: model.UniqueKey, IsDeleted: false },
  });
  if (isExist) {
    if (model.password2 != "" && model.password2 === model.password2Confirm) {
      console.log("new password entered");
      isPasswordConfirmed = true;
      model.Password = md5(model.password2);
    } else if (
      model.password2 === "" &&
      model.password2 === model.password2Confirm
    ) {
      console.log("empty password");
      isPasswordEmpty = true;
    } else {
      console.log("wrong password");
      isPasswordConfirmed = false;
    }

    if (isPasswordConfirmed) {
      await User.update(
        {
          Name: model.Name,
          Surname: model.Surname,
          Address: model.Address,
          Password: model.Password,
        },
        { where: { Id: isExist.Id } }
      );
      res.status(200).send({
        message: "Kullanıcı Bilgileriniz Başarıyla Güncellendi",
        ok: true,
      });
    } else if (isPasswordEmpty) {
      await User.update(
        { Name: model.Name, Surname: model.Surname, Address: model.Address },
        { where: { Id: isExist.Id } }
      );
      res.status(200).send({
        message: "Kullanıcı Bilgileriniz Başarıyla Güncellendi",
        ok: true,
      });
    } else {
      res.status(400).send({
        message: "Kullanıcı Bulunamadı",
        ok: false,
      });
    }
  } else {
    res.status(400).send({
      message: "Kullanıcı Bulunamadı",
      ok: false,
    });
  }
};

module.exports = {
  handler,
};
