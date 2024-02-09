const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const LabelModel = require("../../../model/Label");

const create = async (req, res) => {
    try {
        const {id} = req.params
        const {name, project_id, color, description} = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            color: Joi.string().required(),
        }).options({abortEarly: false, allowUnknown: true});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        const label = await LabelModel.findById(id);
        if (!label instanceof LabelModel) {
            return res.status(400).json({message: "Label not found."});
        }
        // Finding a label with the provided name and project id in the database
        const labelExist = await LabelModel.findOne(
            {
                _id: {$ne: id},
                name,
                project_id
            }
        );
        // If label is found, return a 400 Bad Request response.
        if (labelExist != null) {
            return res.status(400).json({name: "Label already exist with this name."});
        }
        //update a new label
        label.name = name;
        label.color = color;
        label.description = description;
        label.update_at = Date.now();
        await label.save();
        return res.status(201).json({message: 'Label has been updated successfully.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = create