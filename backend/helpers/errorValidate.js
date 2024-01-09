const { validationResult } = require('express-validator')
//handle error validation of the request
const errorValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    next()
}

const customErrorValidation = (path, msg) => {
    return {errors: [{
            msg,
            path
        }]}
}
module.exports = { errorValidation, customErrorValidation }
