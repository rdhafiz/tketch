const express = require("express");
const authRouter = require("./auth.route");
const labelRoute = require("./label.route");
const profileRoute = require("./profile.route");
const projectRoute = require("./project.route");
const userRoute = require("./user.route");
const webRouter = require("./web.route");
const router = express.Router();
const authenticateToken = require('../app/middleware/AuthMiddleware');

router.use("", webRouter);
router.use("/auth", authRouter);
router.use("/label", authenticateToken, labelRoute);
router.use("/profile", authenticateToken, profileRoute);
router.use("/project", authenticateToken, projectRoute);
router.use("/user", authenticateToken, userRoute);

module.exports = router;