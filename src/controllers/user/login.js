const{
    sign,
    decode,
    verify
} = require('jsonwebtoken');
const md5 = require('md5');
const connectToDatabase = require("../../lib/database");

const handler = async (req,res) => {
    const { User, UserRole } = await connectToDatabase();
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

    const claims = {
        usercode: user.UniqueKey,
        fullName: user.Name + user.Surname,
        email: user.Email,
        role: userRole.RoleId
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