// create new Express router
//Require is a fxn. Accepts a parameter "path" and returns module.exports. Loads node.js modules and 3rd party libs like Express and Mongoose, etc.
const mongoose = require('mongoose');
const express = require("express"); 
// const router = express.Router();
const app = express();
const db = require('./config/keys').mongoURI;
const users = require("./routes/api/users");
const User = require('./models/User');
const bodyParser = require('body-parser');
const passport = require('passport');
app.use(passport.initialize());
require('./config/passport')(passport);

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.log(err));
  
  // middleware for body parser. This code needs to go before the routes are setup/imported because body parser populates req.body and needs to be defined before route requests that utilizes it
  // avoids typeError when making a POST request
  app.use(bodyParser.urlencoded({ 
    extended: false 
  }));
  
  app.use(bodyParser.json());
  
// set up basic route to render info
// app.get("/", (req, res) => 
//   // console.log(res)
//   res.send("Hello World boiii")
//  );
const port = process.env.PORT || 5000; // Heroku hosting requires server to run on process.env.PORT, and we are telling the app to run the server on port 5000 otherwise(locally).
// tells Express to start a socket to listen for connections on the path. Logs a success msg on console when server is running successfully
app.listen(port, () => console.log(`Server is running on port ${port}`)); 

// tell Express to use newly imported routes from routes folder
app.use("/api/users", users);


