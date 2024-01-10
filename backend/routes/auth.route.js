const express = require("express");
const router = express.Router();
const AuthController = require('../app/controllers/AuthController/AuthController');

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify", AuthController.verifyAccount);
router.post("/forgot/password", AuthController.forgotPassword);
router.post("/reset/password", AuthController.resetPassword);

module.exports = router;
