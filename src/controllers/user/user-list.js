const {
    sign,
    decode,
    verify
} = require('jsonwebtoken');
const md5 = require('md5');
const connectToDatabase = require("../../lib/database");

const handler = async (req, res) => {
    const { User, UserRole, Role } = await connectToDatabase();
    const users = await User.findAll({
        where: { IsDeleted: false },
        include: {
            model: UserRole,
            include: {
                model: Role,
                attributes: ['Name'],
                required: true
            },
            attributes: ['RoleId'],
            required:true
        },
        attributes: ['UniqueKey', 'SchoolId', 'Name', 'Surname', 'Email'],
    }).map((t) => {
        console.log()
        return {
            id: t.UniqueKey,
            schoolId: t.SchoolId,
            fullName: t.Name + " " + t.Surname,
            email: t.Email,
            role: t.UserRoles[0].Role.Name
        }
    })
    res.status(200).send({
        message: "Success",
        ok: true,
        data: {
            rows:users
        },
      });

}

module.exports = {
    handler
};