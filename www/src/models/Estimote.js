var mongoose = require('mongoose');

var EstimoteModel;

var EstimoteSchema = new mongoose.Schema({
  latitde: {
    type: Number
  },

  longitude: {
    type: Number
  },

  floor: {
    type: Number
  }
});

EstimoteModel = mongoose.model('Estimote', EstimoteSchema);

module.exports.EstimoteModel = EstimoteModel;
module.exports.EstimoteSchema = EstimoteSchema;
