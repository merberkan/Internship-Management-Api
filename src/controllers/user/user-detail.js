
const connectToDatabase = require("../../lib/database");
const {userInfo} = require('../../lib/middleware')

const handler = async (req,res) => {
    try {
        const { User } = await connectToDatabase();
        const userData = await userInfo(req,res);
        if(!userData){
          res.status(400).send({
            message: "User cannot found!",
            data: { isSuccess: false },
          });
        }
        const user = await User.findOne({ where: { UniqueKey: userData.usercode, IsDeleted:false } });
        if(user){
          res.status(200).send({
            data: {isSuccess: true,user}
        });
        }else{
          res.status(400).send({
            message: "User cannot found!",
            data: { isSuccess: false },
          });
        }
      } catch (error) {
        res.status(400).send({
          message: "[USER CONTROLLER]",
          data: { isSuccess: false, error:error },
        });
      }
}

module.exports = {
    handler
};