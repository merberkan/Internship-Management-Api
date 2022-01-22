const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const moment = require("moment");
const { uuid } = require("../../helpers/utils");
var nodemailer = require("nodemailer");

const handler = async (req, res) => {
  const { User, UserRole, UserStakeholder, Stakeholder, Form, UserForm } =
    await connectToDatabase();
  const user = await userInfo(req, res);
  const model = req.body;
  const formUniqueKey = req.params.uniquekey;
  model.companyPersonDate = moment().utc().format("DD/MM/YYYY");
  const form = await Form.findOne({
    where: { UniqueKey: formUniqueKey },
  });
  console.log("form ıd:",form.Id)
  const userForm = await UserForm.findOne({
      where: {FormId: form.Id}
  });

  await UserForm.update(
    { Value: JSON.stringify(model) },
    { where: { Id: userForm.Id } }
  );
  res.status(200).send({
    message: "Form Updated Successfully",
    ok: true,
  });
};

module.exports = {
  handler,
};
