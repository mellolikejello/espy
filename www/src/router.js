var controllers = require('./controllers');

var router = function(app) {
  app.get('/login', controllers.UserCtrl.loginPage);
  app.post('/login', controllers.UserCtrl.login);
  app.get('/signup', controllers.UserCtrl.signupPage);
  app.post('/signup', controllers.UserCtrl.signup);
  app.get('/logout', controllers.UserCtrl.logout);
  app.get('/', controllers.UserCtrl.loginPage);
  app.post('/update', controllers.UserCtrl.updateLocation);
  app.get('/home', controllers.UserCtrl.homePage);
};

module.exports = router;
