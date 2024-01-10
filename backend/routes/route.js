const express = require("express");
const authRouter = require("./auth.route");
const webRouter = require("./web.route");
const router = express.Router();

router.use("", webRouter);
router.use("/auth", authRouter);

module.exports = router;