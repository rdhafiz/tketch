const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const StateModel = require("../../../model/State");

const create = async (req, res) => {
    try {
        const {id} = req.params
        const {name, project_id} = req.body
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
        const state = await StateModel.findById(id);
        if (!state instanceof StateModel) {
            return res.status(400).json({message: "State not found."});
        }
        // Finding a state with the provided name and project id in the database
        const stateExist = await StateModel.findOne(
            {
                _id: {$ne: id},
                name,
                project_id
            }
        );
        // If state is found, return a 400 Bad Request response.
        if (stateExist != null) {
            return res.status(400).json({name: "State already exist with this name."});
        }
        //update a new state
        state.name = name;
        state.update_at = Date.now();
        await state.save();
        return res.status(201).json({message: 'State has been updated successfully.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = create