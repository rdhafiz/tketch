const express = require("express");
const router = express.Router();
const TaskController = require('../app/controllers/TaskController/TaskController');


router.post("/:projectId", TaskController.create);
router.get("/:projectId", TaskController.get);
router.get("/status", TaskController.getStatus);
router.get("/:id", TaskController.getSingle);
router.patch("/:id", TaskController.update);
router.patch("/:id/update/status", TaskController.updateStatus);
router.delete("/:id", TaskController.delete);

module.exports = router;
