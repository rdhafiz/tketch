const { body, validationResult } = require('express-validator')

/**
 * Validates register request
 */
const validateRegister = [
    body('first_name')
        .exists()
        .withMessage('First name field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('First name field is required'),
    body('last_name')
        .exists()
        .withMessage('Last name field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Last name field is required'),
    body('email')
        .exists()
        .withMessage('Email field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Email field is required')
        .isEmail()
        .withMessage('Email is not valid'),
    body('password')
        .exists()
        .withMessage('Password field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Password field is required'),
    body('confirm_password')
        .exists()
        .withMessage('Confirm password field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Confirm password field is required')
        .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
]

/**
 * Validates login request
 */
const validateLogin = [
    body('email')
        .exists()
        .withMessage('Email Field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Email field is required'),
    body('password')
        .exists()
        .withMessage('Password Field is required')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Password field is required'),
]

module.exports = { validateRegister, validateLogin }