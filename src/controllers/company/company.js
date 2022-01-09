const {
    sign,
    decode,
    verify
} = require('jsonwebtoken');
const md5 = require('md5');
const connectToDatabase = require("../../lib/database");

const list = async (req, res) => {
    const { Company } = await connectToDatabase();
    const companyList = await Company.findAll({
        where:{IsDeleted: false}
    }).map((t) => {
        console.log(t)
        return {
            companyName: t.Name,
            companyAddress: t.Address,
            companySector: t.Sector,
            companyPhoneNo: t.PhoneNo,
            companyFaxNo: t.FaxNo,
            companyEmail: t.Email,
            companyWebAddress: t.WebAddress,
            companyCompanyEmployeeNo: t.CompanyEmployeeNo,

        }
      });
    res.status(200).send({
        message: "Success",
        ok: true,
        data: {
            companies: companyList
        },
      });

}

module.exports = {
    list
};