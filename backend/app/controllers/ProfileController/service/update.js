const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const UserService = require("../../../service/UserService");
const fs = require('fs-extra')
const HandleUpload = require("../../../helpers/handleUpload");
const update = async (req, res) => {
    try {
        // get value from request body
        const { name } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            avatar: Joi.object({
                // Validate file type (e.g., image, pdf, etc.)
                mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
            }),
        }).options({abortEarly: false});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }

        const { sessionUser } = req
        // Finding the user
        const user = await UserModel.findById(sessionUser._id);
        // If no user is found, return a 400 Bad Request response
        if (!user instanceof UserModel) {
            return res.status(400).json({ message: "No user found." });
        }
        //process file upload
        if (req.files) {
            const supportedMine = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedMine.includes(req.files.avatar.mimetype)) {
                return res.status(400).json({ avatar: "File format not supported. Only support jpeg, jpg, png" });
            }
            let fileName = await HandleUpload.uploadFile(req.files.avatar)
            fs.remove('./uploads/' + user.avatar)
            user.avatar = fileName
        }
        user.name = name;
        await user.save();
        res.status(200).json({ data: UserService.parseData(user), message: 'profile has been updated successfully', status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = update