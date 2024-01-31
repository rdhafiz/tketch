const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const HandleUpload = require("../../../helpers/handleUpload");
const ProjectModel = require("../../../model/Project");
const fs = require("fs-extra");

const update = async (req, res) => {
    try {
        const {id} = req.params
        const {name, description, members_id } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(null),
            icon: Joi.allow(null)
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        const project = await ProjectModel.findById(id);
        if (!project instanceof ProjectModel) {
            return res.status(400).json({message: 'Project not found'});
        }
        let iconName = null
        if (req.files) {
            const supportedMime = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedMime.includes(req.files.icon.mimetype)) {
                return res.status(400).json({ avatar: "File format not supported. Only support jpeg, jpg, png" });
            }
            iconName = await HandleUpload.uploadFile(req.files.icon)
            fs.remove('./uploads/' + project.icon)
        }
        let members = JSON.parse(members_id)
        members.push(req.sessionUser._id)
        await ProjectModel.updateOne(
            {_id: id},
            {$set: {members_id: members, name, description, icon:iconName}}).exec()
        return res.status(200).json({message: 'Project has been updated successfully.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = update