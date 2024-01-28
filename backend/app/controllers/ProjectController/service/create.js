const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const HandleUpload = require("../../../helpers/handleUpload");
const ProjectModel = require("../../../model/Project");

const create = async (req, res) => {
    try {
        // get session user from request body
        const { sessionUser } = req
        const { name, description , members_id} = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow(null, ''),
            icon: Joi.allow(null),
            members_id: Joi.string().allow(null),
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // adding member
        let members = JSON.parse(members_id)
        members.push(sessionUser._id)
        const projectData = {
            name: name,
            description: description,
            creator_id: sessionUser._id,
            members_id: members
        }
        //process file upload
        if (req.files) {
            const supportedMime = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedMime.includes(req.files.icon.mimetype)) {
                return res.status(400).json({ avatar: "File format not supported. Only support jpeg, jpg, png" });
            }
            projectData.icon = await HandleUpload.uploadFile(req.files.icon)
        }
        //create a new project
        await ProjectModel.create(projectData)
        return res.status(201).json({message: 'Project has been created successfully.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = create