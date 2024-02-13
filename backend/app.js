// Importing the database configuration from the 'db.js' file located in the 'config' folder
require("./config/db");

// Importing the 'express' module for building the web application
const express = require("express");
// Creating an instance of the Express application
const app = express();

app.use('/uploads', express.static('./uploads'));

// Importing the 'cors' module for enabling Cross-Origin Resource Sharing
const cors = require("cors");
// Enabling Cross-Origin Resource Sharing for all routes
app.use(cors());

// Importing express file upload package
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Parsing incoming requests with URL-encoded payloads
app.use(express.urlencoded({limit: "50mb", extended: true }));
// Parsing incoming requests with JSON payloads
app.use(express.json({limit: "50mb"}));


// Importing the 'router' module from the 'route.js' file located in the 'routes' folder
const router = require("./routes/route");
// Mounting the router at the root level of the application
app.use("", router);


// Middleware for handling 404 errors (Route not found)
app.use((req, res, next) => {res.status(404).json({message: "Route not found"});});
// Middleware for handling internal server errors (500 errors)
app.use((err, req, res, next) => {res.status(500).json({message: "Server error"});});


// Exporting the configured Express application for use in other modules
module.exports = app;
