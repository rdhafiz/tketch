const UserServices = require("../../../service/UserService");
const UserModel = require("../../../model/User");
const get = async (req, res) => {
    try {
        // get session user from request body
        const { sessionUser } = req
        if (!sessionUser instanceof UserModel) {
            return res.status(400).json({message: 'Cannot find user'});
        }
        // Returning a 200 OK response with user
        res.status(200).json({ data: UserServices.parseData(sessionUser), status: 'ok' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = get