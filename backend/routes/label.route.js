const express = require("express");
const router = express.Router();
const LabelController = require('../app/controllers/LabelController/LabelController');


router.post("/", LabelController.create);
router.get("/:projectId", LabelController.get);
router.patch("/:id", LabelController.update);
router.delete("/:id", LabelController.delete);

module.exports = router;
