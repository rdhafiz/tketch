const User = require("../../models/auth.model");

/**
 * @desc register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @access - public
 */
const register = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    register,
    login,
};
