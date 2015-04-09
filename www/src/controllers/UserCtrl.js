var models = require('../models');
var User = models.User;

var homePage = function(req, res) {
  res.render('home');
};

var loginPage = function(req, res) {
  res.render('login');
};

var signupPage = function(req, res) {
  res.render('signup');
};

var logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

var login = function(req, res) {
  var username = req.body.username;

  User.UserModel.authenticate(username, function(err, user) {
    if (err || !user) {
      if (err) {
        console.log(err);
        return res.status(401).json({error: "Oops! Something went wrong..."});
      } else {
        console.log(username + ' does not exist');
      }
    } else {
      console.log('welcome ' + username);
      res.json({redirect: '/home'});
    }
  });
};

var signup = function(req, res) {
  console.log(req.body.username);

  var userData = {
    username: req.body.username,
    location: null,
    visited: null,
    age: null,
    queue: null
  };

  var newUser = new User.UserModel(userData);
  newUser.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).json({error: "Username already exist"});
    } else {
      console.log(newUser.username + " created");
      res.json({redirect: '/home'});
    }
  });
};

var updateLocation = function(req, res) {
  User.UserModel.updateLocation('5521b6e6b52a231d87968300', '{0, 0}', function(location) {
    console.log(location);
  });
};

// Exports
module.exports.loginPage = loginPage;
module.exports.signupPage = signupPage;
module.exports.homePage = homePage;

module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.updateLocation = updateLocation;
