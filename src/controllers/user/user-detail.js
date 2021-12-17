
const connectToDatabase = require("../../lib/database");

const handler = async (req,res) => {
    try {
        const { User } = await connectToDatabase();
        const user = await User.findOne({ where: { Id: 1 } });
        res.status(200).send({
            message: "Success",
            data: user
        });
        console.log("user:", user);
      } catch (error) {
        console.log("[USER CONTROLLER:]", error);
      }
}

module.exports = {
    handler
};