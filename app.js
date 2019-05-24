// create new Express server
//Require is a fxn. Accepts a parameter "path" and returns module.exports. Loads node.js modules and 3rd party libs like Express and Mongoose, etc.
const mongoose = require('mongoose');
const express = require("express"); 
const app = express();
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.log(err));

// set up basic route to render info
app.get("/", (req, res) => res.send("Hello World boiii"));
const port = process.env.PORT || 5000; // Heroku hosting requires server to run on process.env.PORT, and we are telling the app to run the server on port 5000 otherwise(locally).
// tells Express to start a socket to listen for connections on the path. Logs a success msg on console when server is running successfully
app.listen(port, () => console.log(`Server is running on port ${port}`)); 



