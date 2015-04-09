var mongoose = require('mongoose');

var ExhibitModel;

var ExhibitSchema = new mongoose.Schema({
  name: {
    type: String
  },

  latitude: {
    type: Number
  },

  longitude: {
    type: Number
  },

  building: {
    type: String
  },

  description: {
    type: String
  },

  tags: {
    type: Array
  },

  contributors: {
    type: String
  },

  radius: {
    type: Number
  },

  events: {
    type: Array
  },

  ratings: {
    type: Array
  }
});

ExhibitSchema.statics.findByTag = function(tag, callback) {
  var search = {
    tags: { $contains: tag }
  };

  return ExhibitModel.find(search, callback);
};

ExhibitModel = mongoose.model('Exhibit', ExhibitSchema);

module.exports.ExhibitModel = ExhibitModel;
module.exports.ExhibitSchema = ExhibitSchema;
