const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const bcrypt = require("bcrypt");
const updatePassword = async (req, res) => {
    try {
        const schema = Joi.object({
            current_password: Joi.string().min(6).required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).min(6).required()
        }).options({abortEarly: false});
        const validator = await schema.validate(req.body);
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }

        const user = await UserModel.findById(req.sessionUser._id);
        if (!user instanceof UserModel) {
            return res.status(400).json({message: "No user found."});
        }

        const hashCheck = await bcrypt.compare(req.body.current_password, user.password);
        if (!hashCheck) {
            return res.status(400).json({current_password: "Invalid Password! Please try again."});
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(req.body.password, salt)
        user.save()
        res.status(200).json({message: "Password has been updated successfully.", status: 'ok'});
    } catch (error) {
        // Handling any unexpected errors and returning a 500 Internal Server Error response
        res.status(500).send(error.message);
    }
}
module.exports = updatePassword