const express = require("express");
const router = express.Router();

const {
    validateRegister,
    validateLogin,
} = require('../controllers/authController/auth.validator')

const {errorValidation} = require('../helpers/errorValidate')

const {
    register,
    login,
} = require("../controllers/authController/auth.controller");

router.post("/register", validateRegister, errorValidation, register);
router.post("/login", validateLogin, errorValidation, login);

module.exports = router;