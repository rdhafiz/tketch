const express = require("express");
const authRouter = require("./auth.route");
const labelRoute = require("./label.route");
const profileRoute = require("./profile.route");
const projectRoute = require("./project.route");
const userRoute = require("./user.route");
const stateRoute = require("./state.route");
const taskRoute = require("./task.route");
const webRouter = require("./web.route");
const router = express.Router();
const authenticateToken = require('../app/middleware/AuthMiddleware');

router.use("", webRouter);
router.use("/auth", authRouter);
router.use("/label", authenticateToken, labelRoute);
router.use("/profile", authenticateToken, profileRoute);
router.use("/project", authenticateToken, projectRoute);
router.use("/user", authenticateToken, userRoute);
router.use("/state", authenticateToken, stateRoute);
router.use("/task", authenticateToken, taskRoute);

module.exports = router;