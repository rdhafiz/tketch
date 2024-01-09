const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require("../../models/auth.model");
const {customErrorValidation} = require('../../helpers/errorValidate')

/**
 * @desc register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @access - public
 */
const register = async (req, res) => {

    try {
        // get all value from request body
        const { first_name, last_name, email, password } = req.body
        // Check if user exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json(customErrorValidation('email', 'User is already exist with this email'))
        }
        // Hash password
        bcrypt.hash(password, 10, async function(err, hash) {
            // Create user
            const user = await User.create({
                first_name,
                last_name,
                email,
                password: hash,
            })
            if (user) {
                res.status(201).json({message: 'User created successfully'})
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
/**
 * @desc login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @access - public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check for user email
        const user = await User.findOne({ email })
        if (user == null) {
            return res.status(400).json(customErrorValidation('email', 'Email does not exist'))
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (user && isPasswordMatched) {
            res.status(200).json({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar: user.avatar,
                email: user.email,
                token: generateToken(user._id),
            })
        } else {
            res.status(400).json(customErrorValidation('email', 'Invalid credential'))
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    register,
    login,
};
