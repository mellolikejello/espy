// Import libraries
var path = require('path');
var url = require('url');
var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// MongoDB
var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/espyDB";
var db = mongoose.connect(dbURL, function(error) {
  if (error) {
    console.log("Unable to connect to database");
    throw error;
  }
});

// Redis
var redisPASS;
var redisURL = {
  hostname: 'localhost',
  port: 6379
};

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(":")[1];
}

// Application
var app = express();
app.use('/assets', express.static(path.resolve(__dirname + '../../client')));
app.use(session({
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS
  }),
  secret: 'LetSplit Secret',
  resave: true,
  saveUninitialized: true
}));
app.set('views', __dirname + '/views');

// Server
var port = process.env.PORT || process.env.NODE_PORT || 3000;
var server = app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  console.log("Listening on port " + port);
});
