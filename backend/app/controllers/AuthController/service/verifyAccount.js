const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const jwt = require("jsonwebtoken");
const UserServices = require("../../../service/UserService");
const verifyAccount = async (req, res) => {
    try {
        // get value from request body
        const { code, email } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            code: Joi.string().required(),
            email: Joi.string().email().required(),
        }).options({abortEarly: false});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // Finding the user with the provided email and code in the database
        const user = await UserModel.findOne({ email, activation_code: code });
        // If no user is found, return a 400 Bad Request response indicating invalid credentials
        if (user == null) {
            return res.status(400).json({ code: "No user found." });
        }
        user.activation_code = null;
        await user.save();
        // Generating a JWT access token for the authenticated user
        const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        // Returning a 200 OK response with user data and the generated access token
        res.status(200).json({ data: UserServices.parseData(user), access_token: access_token, status: 'ok' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = verifyAccount