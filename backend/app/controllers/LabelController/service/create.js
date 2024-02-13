const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const LabelModel = require("../../../model/Label");

const create = async (req, res) => {
    try {
        // get session user from request body
        const { sessionUser } = req
        const { name, project_id, color, description } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            project_id: Joi.string().required(),
            color: Joi.string().required(),
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // Finding a label with the provided name and project id in the database
        const labelExist = await LabelModel.findOne({ name, project_id: project_id });
        // If label is found, return a 400 Bad Request response.
        if (labelExist != null) {
            return res.status(400).json({ name: "Label already exist with this name." });
        }
        //create a new label
        await LabelModel.create({
            name: name,
            project_id: project_id,
            color: color,
            description: description,
            creator_id: sessionUser._id,
        });
        return res.status(201).json({message: 'Label has been created successfully.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = create