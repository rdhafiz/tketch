const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const StateModel = require("../../../model/State");

const create = async (req, res) => {
    try {
        // get session user from request body
        const { sessionUser } = req
        const { name, project_id} = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            project_id: Joi.string().required(),
        }).options({abortEarly: false});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // Finding a status with the provided name and project id in the database
        const statusExist = await StateModel.findOne({ name, project_id: project_id });
        // If status is found, return a 400 Bad Request response.
        if (statusExist != null) {
            return res.status(400).json({ name: "State already exist with this name." });
        }
        //create a new status
        await StateModel.create({
            name: name,
            project_id: project_id,
            creator_id: sessionUser._id,
        });
        return res.status(201).json({message: 'State has been created successfully.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = create