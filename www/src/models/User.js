var mongoose = require('mongoose');

var UserModel;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique : true
  },

  age: {
    type: String
  },

  location: {
    type: Array
  },

  visited: {
    type: Array
  },

  queue: {
    type: String
  }
});

UserSchema.statics.findAllUsers = function(callback) {
  return UserModel.find(function(err, users) {
    if (err) console.log(err);
    return callback(users);
  });
};

UserSchema.statics.findByUsername = function(name, callback) {
  var search = {
    username: name
  };

  return UserModel.findOne(search, callback);
};

UserSchema.statics.authenticate = function(username, callback) {
  return UserModel.findByUsername(username, function(err, doc) {
    if (err || !doc) {
      if (err) {
        console.log(err);
        return callback(err);
      } else {
        return callback();
      }
    } else {
      console.log(doc);
      return doc;
    }
  });
};

UserSchema.statics.updateLocation = function(id, location, callback) {
  return UserModel.findOne({ _id: id }, function(err, user) {
    if (err || !user) {
      console.log("Failed to update location");
    } else {
      console.log(user.location);
      return callback(user.location);
    }
  });
};

UserModel = mongoose.model('User', UserSchema);

module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;
