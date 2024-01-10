// Importing the 'app' module from the local file 'app.js'
const app = require("./app");

// Importing configuration settings from the 'config.js' file located in the 'config' folder
const config = require("./config/config");

// Extracting the 'port' configuration from the imported 'config' object
const PORT = config.app.port;

// Start the server to listen on the specified port
app.listen(PORT, () => {
    // Display a message when the server is successfully running
    console.log(`app is running on http://localhost:${PORT}`);
});
