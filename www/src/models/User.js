var mongoose = require('mongoose');

var UserModel;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },

  location: {
    type: Array
  },

  visited: {
    type: Array
  }
});

UserModel = mongoose.model('User', UserSchema);

module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;
