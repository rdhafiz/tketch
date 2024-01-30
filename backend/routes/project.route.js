const express = require("express");
const router = express.Router();
const ProjectController = require('../app/controllers/ProjectController/ProjectController');


router.post("/", ProjectController.create);
router.get("/", ProjectController.get);
router.get("/status", ProjectController.getStatus);
router.get("/:id", ProjectController.getSingle);
router.patch("/:id", ProjectController.update);
router.patch("/:id/update/status", ProjectController.updateStatus);
router.delete("/:id", ProjectController.delete);

module.exports = router;
