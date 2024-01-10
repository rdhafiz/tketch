const express = require("express");
const router = express.Router();
const WebController = require('../app/controllers/WebController');

router.get("/", WebController.index);

module.exports = router;