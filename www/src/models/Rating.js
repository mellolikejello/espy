var mongoose = require('mongoose');

var RatingModel;

var RatingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: 'User'
  },

  exhibitId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: 'Exhibit'
  },

  rating: {
    type: Number,
    require: true
  }
});

RatingModel = mongoose.model('Rating', RatingSchema);

module.exports.RatingModel = RatingModel;
module.exports.RatingSchema = RatingSchema;
