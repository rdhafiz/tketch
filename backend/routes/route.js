const express = require("express");
const authRouter = require("./auth.route");
const labelRoute = require("./label.route");
const profileRoute = require("./profile.route");
const webRouter = require("./web.route");
const router = express.Router();
const authenticateToken = require('../app/middleware/AuthMiddleware');

router.use("", webRouter);
router.use("/auth", authRouter);
router.use("/label", authenticateToken, labelRoute);
router.use("/profile", authenticateToken, profileRoute);

module.exports = router;