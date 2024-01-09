const express = require("express");
const cors = require("cors");
require("./config/db");
const apiVersion = '/api/v0.1'

const userRouter = require("./routes/auth.route");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(apiVersion+"/user", userRouter);

app.get('/', (req, res) => {
    res.send('Welcome to tketch server');
})

// route not found error
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found",
    });
});

//handling server error
app.use((err, req, res, next) => {
    res.status(500).json({
        message: "server error",
    });
});

module.exports = app;