const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const TaskModel = require("../../../model/Task");

const create = async (req, res) => {
    try {
        // get session user from request body
        const { sessionUser } = req
        const { name } = req.body
        const { projectId } = req.params
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        const lastTask =  await TaskModel.find({project_id: projectId}).sort({ _id: -1 }).limit(1).exec()
        console.log(lastTask)
        const taskData = {
            name: name,
            project_id: projectId,
            creator_id: sessionUser._id,
            number: lastTask.length > 0 ? lastTask[0].number + 1 : 1
        }
        //create a new task
        const task = await TaskModel.create(taskData)
        return res.status(201).json({message: 'Task has been created successfully.', task_id: task._id, status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = create