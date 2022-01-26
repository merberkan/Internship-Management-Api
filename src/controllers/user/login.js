const{
    sign,
    decode,
    verify
} = require('jsonwebtoken');
const md5 = require('md5');
const connectToDatabase = require("../../lib/database");

const handler = async (req,res) => {
    const { User, UserRole, Department,Company, Stakeholder, StakeholderCompany } = await connectToDatabase();
    const model = req.body;
    console.log("gelen body:",model)
    const user = await User.findOne({ where: { Email: model.email, IsDeleted: false } });
    if(user == null){
        res.status(400).send({
            message: "User_NotFound",
            ok: false
          });
    } 
    if(user.Password !== md5(model.password)){
        res.status(400).send({
            message: "User_NotFound",
            ok: false
          });
    } 

    const userRole = await UserRole.findOne({
        where: {UserId: user.Id},
        attributes: ['RoleId']
    });
    let userDepartment;
    let stakeholder;
    let stakeholderCompany;
    if(userRole.RoleId != 6){
        userDepartment = await Department.findOne({
            where: {Id: user.DepartmentId},
            attributes: ['Name']
        });
    }else{
        stakeholder = await Stakeholder.findOne({
            where: {IsDeleted:false, Email:model.email},
        });

        stakeholderCompany = await StakeholderCompany.findOne({
            where:{StakeholderId: stakeholder.Id},
            include:{
                model:Company,
                required:true,
                attributes: ["Name","Address","Sector","PhoneNo","FaxNo","Email","WebAddress","CompanyEmployeeNo","UniqueKey"]
            }
        })
    }


    const claims = {
        usercode: user.UniqueKey,
        fullName: user.Name +" "+ user.Surname,
        email: user.Email,
        role: userRole.RoleId,
        studentNo: user.SchoolId,
        citizenshipNo: user.CitizenshipNo,
        address: user.Address,
        department: userDepartment ? userDepartment.Name:null,
        phone: user.Phone,
        birth: user.BirthDate,
        faculty: user.Faculty,
        stakeholderCompanyUniqueKey: stakeholder ? stakeholderCompany.Company.dataValues.UniqueKey:''
    }
    const token = sign(claims, 'shhhhh');
    res.status(200).send({
        message: "Login Success",
        ok: true,
        data: {
            token,
            claims
        },
      });

}

module.exports = {
    handler
};