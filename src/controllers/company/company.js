const { sign, decode, verify } = require("jsonwebtoken");
const md5 = require("md5");
const connectToDatabase = require("../../lib/database");

const list = async (req, res) => {
  const { Company } = await connectToDatabase();
  const companyList = await Company.findAll({
    where: { IsDeleted: false },
  }).map((t) => {
    console.log(t);
    return {
      companyName: t.Name,
      companyAddress: t.Address,
      companySector: t.Sector,
      companyPhoneNo: t.PhoneNo,
      companyFaxNo: t.FaxNo,
      companyEmail: t.Email,
      companyWebAddress: t.WebAddress,
      companyCompanyEmployeeNo: t.CompanyEmployeeNo,
    };
  });
  res.status(200).send({
    message: "Success",
    ok: true,
    data: {
      companies: companyList,
    },
  });
};

const update = async (req, res) => {
  const { Company } = await connectToDatabase();
  const model = req.body;
  const company = await Company.findOne({
    where: { UniqueKey: model.companyUniqueKey, IsDeleted: false },
  });

  if (!company) {
    res.status(400).send({
      message: "Company NotFound",
      ok: false,
    });
  } else {
    await Company.update(
      { Name: model.name, Address: model.address, 
        Sector: model.sector, PhoneNo: model.phone,
         FaxNo: model.fax, Email: model.email,
        WebAddress: model.web, CompanyEmployeeNo: model.employeeNo },
      { where: { Id: company.Id } }
    );
  }
  res.status(200).send({
    message: "Success",
    ok: true,
  });
};

const detail = async (req, res) => {
    const { Company } = await connectToDatabase();
    const key = req.params.uniquekey;
    const company = await Company.findOne({
        where: {UniqueKey: key, IsDeleted: false}
    })

    if(!company){
        res.status(400).send({
            message: "Company NotFound",
            ok: false,
          });
    }else{
        const model = {
            name: company.Name,
            address: company.Address,
            sector: company.Sector,
            phone: company.PhoneNo,
            fax: company.FaxNo,
            email: company.Email,
            web: company.WebAddress,
            employeeNo: company.CompanyEmployeeNo
        }
        
        res.status(200).send({
            message: "Success",
            ok: true,
            data: {
              company: model,
            },
          });
    }

  };

module.exports = {
  list,
  update,
  detail
};
