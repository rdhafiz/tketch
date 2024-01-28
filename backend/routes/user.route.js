const express = require("express");
const router = express.Router();
const UserController = require('../app/controllers/UserController/UserController');


router.get("/", UserController.get);

module.exports = router;
