const express = require("express");
const router = express.Router();
const TaskController = require('../app/controllers/TaskController/TaskController');


router.post("/:projectId", TaskController.create);
router.get("/:projectId", TaskController.get);
router.get("/status", TaskController.getStatus);
router.get("/single/:id", TaskController.getSingle);
router.patch("/:id", TaskController.update);
// router.patch("/:id/name", TaskController.nameUpdate);
// router.patch("/:id/desc", TaskController.descUpdate);
// router.patch("/:id/add/comment", TaskController.descUpdate);
// router.patch("/:id/add/attachment", TaskController.descUpdate);
// router.patch("/:id/update/info", TaskController.descUpdate);
router.patch("/:id/update/status", TaskController.updateStatus);
router.delete("/:id", TaskController.delete);

module.exports = router;
