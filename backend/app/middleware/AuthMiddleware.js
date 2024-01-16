const jwt = require('jsonwebtoken');
const UserModel = require("../model/User");
const UserServices = require("../service/UserService");

async function authenticateToken (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Forbidden: Invalid token'});
        }
        let sessionUser = await UserModel.findById(user.id);
        req.sessionUser = UserServices.parseData(sessionUser)
        next();
    });
}

module.exports = authenticateToken;
