const Joi = require("joi");
const Validator = require("../../../helpers/validator");
const UserModel = require("../../../model/User");
const MailTemplate = require("../../../service/MailTemplateService");
const MailService = require("../../../service/MailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserServices = require("../../../service/UserService");

const login = async (req, res) => {
    try {
        // get value from request body
        const { email, password } = req.body
        // Defining the schema for request body validation using "Joi"
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }).options({abortEarly: false});

        // Validating the request body against the defined schema
        const validator = await schema.validate(req.body);
        // If validation fails, return a 400 Bad Request response with validation errors
        if (validator.error !== undefined) {
            return res.status(400).json(Validator.parseError(validator.error));
        }

        // Finding a user with the provided email in the database
        const user = await UserModel.findOne({ email }).exec();
        // If no user is found, return a 400 Bad Request response indicating invalid credentials
        if (user == null) {
            return res.status(400).json({ email: "Invalid Credential! Please try again." });
        }

        if (user.activation_code != null) {
            // sending mail to the user to active the account
            const mailTemplate = MailTemplate.activationTemplate;
            const placeHolderReplacement = {name: user.name, activationCode: user.activation_code}
            const message = MailTemplate.processPlaceholder(mailTemplate.body, placeHolderReplacement)
            const mailOptions = {
                from:  process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: mailTemplate.subject,
                html: message
            }
            MailService.sendMail(mailOptions);
            return res.status(200).json({message: 'A verification mail has been sent to your email, Please verify the email to login', status: 'email sent'})
        }

        // Comparing the provided password with the hashed password stored in the database
        const hashCheck = await bcrypt.compare(password, user.password);
        // If the password does not match, return a 400 Bad Request response indicating invalid credentials
        if (!hashCheck) {
            return res.status(400).json({ email: "Invalid Credential! Please try again." });
        }

        // Generating a JWT access token for the authenticated user
        const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Returning a 200 OK response with user data and the generated access token
        res.status(200).json({ data: UserServices.parseData(user), access_token: access_token, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = login