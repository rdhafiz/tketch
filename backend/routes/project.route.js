const express = require("express");
const router = express.Router();
const ProjectController = require('../app/controllers/ProjectController/ProjectController');


router.post("/", ProjectController.create);
router.get("/", ProjectController.get);
router.patch("/:id", ProjectController.update);
router.patch("/:id/update/status", ProjectController.updateStatus);
router.patch("/:id/add/member", ProjectController.addMember);
router.patch("/:id/remove/member", ProjectController.removeMember);
router.delete("/:id", ProjectController.delete);

module.exports = router;
