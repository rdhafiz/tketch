const express = require("express");
const router = express.Router();
const StateController = require('../app/controllers/StateController/StateController');


router.post("/", StateController.create);
router.get("/:projectId", StateController.get);
router.patch("/:id", StateController.update);
router.delete("/:id", StateController.delete);

module.exports = router;
