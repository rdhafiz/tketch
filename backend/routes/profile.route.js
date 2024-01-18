const express = require("express");
const router = express.Router();
const ProfileController = require('../app/controllers/ProfileController/ProfileController');

router.get("/", ProfileController.get);
router.patch("/", ProfileController.update);
router.patch("/password/update", ProfileController.updatePassword);

module.exports = router;
