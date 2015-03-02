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

  floor: {
    type: Number
  },

  description: {
    type: String
  },

  tags: {
    type: Array
  },

  contributors: {
    type: String
  }

  collisionRadius: {
    type: Number
  },

  events: {
    type: Array
  }
});

ExhibitModel = mongoose.model('Exhibit', ExhibitSchema);

module.exports.ExhibitModel = ExhibitModel;
module.exports.ExhibitSchema = ExhibitSchema;
