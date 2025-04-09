
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
