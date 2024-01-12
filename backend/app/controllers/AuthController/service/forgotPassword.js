const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const MailTemplate = require("../../../service/MailTemplateService");
const MailService = require("../../../service/MailService");

const forgotPassword = async (req, res) => {
    try {
        // get value from request body
        const { email } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            email: Joi.string().email().required(),
        }).options({abortEarly: false});
        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }
        // Finding a user with the provided email in the database
        const user = await UserModel.findOne({ email });
        // If no user is found, return a 400 Bad Request response indicating invalid credentials
        if (user == null) {
            return res.status(400).json({ email: "Invalid email." });
        }
        // update user collection reset code
        user.reset_code = Math.random().toString(36).slice(2, 10)
        await user.save();

        // sending mail to the user
        const mailTemplate = MailTemplate.forgotPasswordTemplate;
        const placeHolderReplacement = {name: user.name, resetCode: user.reset_code}
        const message = MailTemplate.processPlaceholder(mailTemplate.body, placeHolderReplacement)
        const mailOptions = {
            from:  process.env.MAIL_FROM_ADDRESS,
            to: email,
            subject: mailTemplate.subject,
            html: message
        }
        MailService.sendMail(mailOptions);
        return res.status(200).json({message: 'A reset code has been sent to your email.', status: 'ok'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = forgotPassword