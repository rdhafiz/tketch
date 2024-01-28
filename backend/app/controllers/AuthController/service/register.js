const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const bcrypt = require("bcrypt");
const MailTemplate = require("../../../service/MailTemplateService");
const MailService = require("../../../service/MailService");
const randomColor = require("../../../helpers/generateRandomColor")
const register = async (req, res) => {
    try {
        // get value from request body
        const { name, email, password } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).min(6).required(),
        }).options({abortEarly: false});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // Finding a user with the provided email in the database
        const userExist = await UserModel.findOne({ email });
        // If no user is found, return a 400 Bad Request response indicating invalid credentials
        if (userExist != null) {
            return res.status(400).json({ email: "User is already exist with this email" });
        }
        const activationCode = Math.random().toString(36).slice(2, 10);
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
            name,
            email,
            color: randomColor(),
            password: hashPassword,
            activation_code: activationCode,
        })
        if (user) {
            // sending mail to the user to active the account
            const mailTemplate = MailTemplate.activationTemplate;
            const placeHolderReplacement = {name, activationCode}
            const message = MailTemplate.processPlaceholder(mailTemplate.body, placeHolderReplacement)
            const mailOptions = {
                from:  process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: mailTemplate.subject,
                html: message
            }
            MailService.sendMail(mailOptions);
            // Returning a 200 OK response with message to verify account
            res.status(201).json({message: 'A verification mail has been sent to your email, Please verify the email to login', status: 'ok'})
        }

    } catch (error) {
        // Handling any unexpected errors and returning a 500 Internal Server Error response
        res.status(500).send(error.message);
    }
}
module.exports = register