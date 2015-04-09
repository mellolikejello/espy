// Import libraries
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');

// MongoDB
var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/espyDB";
var db = mongoose.connect(dbURL, function(error) {
  if (error) {
    console.log("Unable to connect to database");
    throw error;
  }
});

// Application
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// Routes
var router = require('./router.js');
router(app);

// Server
var port = process.env.PORT || process.env.NODE_PORT || 3000;
var server = app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  console.log("Listening on port " + port);
});
