const TaskModel = require("../../../model/Task");
const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const HandleUpload = require("../../../helpers/handleUpload");
const fs = require("fs-extra");
const path = require("path");
const getAttachment = require("./getAttachment")
const addAttachment = async (req, res) => {
    try {
        const {sessionUser} = req
        const {id} = req.params
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            file: Joi.object({
                // Validate file type (e.g., image, pdf, etc.)
                mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
            }),
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        let attachmentData = {
            user_id: sessionUser._id,
            file_name: '',
            file_path: '',
        }
        if (req.files) {
            const supportedMine = ['.jpeg', '.png', '.jpg', '.pdf', '.doc', '.docx', '.xls', '.xlsx']
            const fileExt = path.extname(req.files.file.name)
            if (!supportedMine.includes(fileExt)) {
                return res.status(400).json({file: "File format not supported. Only support jpeg, jpg, png, pdf, doc, docx, xls, xlsx"});
            }
            attachmentData.file_path = await HandleUpload.uploadFile(req.files.file)
            attachmentData.file_name = req.files.file.name
        }
        const task = await TaskModel.updateOne({_id: id}, {$push: {attachment: attachmentData}}).exec()
        if (task.modifiedCount > 0) {
            const attachments = await getAttachment(id)
            // Returning a 200 OK response with message
            return res.status(200).json({message: 'Task attachment has been created successfully', attachments: attachments[0].attachment, status: 'ok'});
        }
        res.status(400).json({message: 'Cannot update Task',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = addAttachment