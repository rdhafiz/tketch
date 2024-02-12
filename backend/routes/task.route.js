const express = require("express");
const router = express.Router();
const TaskController = require('../app/controllers/TaskController/TaskController');


router.post("/:projectId", TaskController.create);
router.get("/:projectId", TaskController.get);
router.get("/status", TaskController.getStatus);
router.get("/single/:id", TaskController.getSingle);
router.patch("/:id", TaskController.update);
router.patch("/:id/name", TaskController.nameUpdate);
router.patch("/:id/desc", TaskController.descUpdate);
router.patch("/:id/comment", TaskController.addComment);
router.patch("/:id/comment/:commentId", TaskController.updateComment);
router.delete("/:id/comment/:commentId", TaskController.deleteComment);
router.patch("/:id/manage/assignee", TaskController.manageAssignee);
router.patch("/:id/manage/label", TaskController.manageLabel);
router.patch("/:id/manage/state", TaskController.manageState);
router.patch("/:id/update/status", TaskController.updateStatus);
router.patch("/:id/update/priority", TaskController.updatePriority);
router.patch("/:id/add/attachment", TaskController.addAttachment);
router.delete("/:id/delete/attachment/:attachmentId", TaskController.deleteAttachment);
router.patch("/:id/due/date", TaskController.dueDate);
router.delete("/:id", TaskController.delete);

module.exports = router;
