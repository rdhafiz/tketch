const TaskModel = require("../../../model/Task");
const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const descUpdate = async (req, res) => {
    try {
        const {id} = req.params
        const {description} = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            description: Joi.string().allow(null),
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        const task = await TaskModel.updateOne({_id: id}, {description: description}).exec()
        if (task.modifiedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'Task description has been update successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot update Task',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = descUpdate