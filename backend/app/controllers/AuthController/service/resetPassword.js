const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const bcrypt = require("bcrypt");
const resetPassword = async (req, res) => {
    try {
        // get value from request body
        const { code, email, password } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            code: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).min(6).required(),
        }).options({abortEarly: false});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // Finding the user with the provided email and code in the database
        const user = await UserModel.findOne({ email, reset_code: code });
        // If no user is found, return a 400 Bad Request response indicating invalid credentials
        if (user == null) {
            return res.status(400).json({ code: "Reset code does not match." });
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        user.reset_code = null;
        user.password = hashPassword;
        await user.save();
        // Returning a 200 OK response with message
        res.status(200).json({ message: 'Password has been reset successfully, Login with your new password', status: 'ok' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = resetPassword