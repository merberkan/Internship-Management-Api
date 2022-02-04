const connectToDatabase = require("../../lib/database");
const { userInfo } = require("../../lib/middleware");
const moment = require("moment");
const { uuid } = require("../../helpers/utils");
var nodemailer = require("nodemailer");

const handler = async (req, res) => {
  const { User, UserRole, UserStakeholder, Stakeholder, Form, UserForm } =
    await connectToDatabase();
  console.log("testing")
  const user = await userInfo(req, res); //77db8955a80b4b16a3d76999a38d7c5
  console.log("user:",user)
  const model = req.body;
  const formUniqueKey = req.params.uniquekey;
  model.companyPersonDate = moment().utc().format("DD/MM/YYYY");
  const form = await Form.findOne({
    where: { UniqueKey: formUniqueKey },
  });
  const myStakeholder = await Stakeholder.findOne({
    where: { Email: user.email },
  });
  console.log("form ıd:",form.Id)
  const userForm = await UserForm.findOne({
      where: {FormId: form.Id}
  });
  console.log("istek geldi")
  await UserForm.update(
    { Value: JSON.stringify(model), StakeholderId: myStakeholder.Id },
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
