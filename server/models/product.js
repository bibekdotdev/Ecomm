const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    trim: true,
  },
  description: {
    type: String,
    required: true, 
    trim: true,
  },
  price: {
    type: Number,
    required: true, 
    min: 0,
  },
  quantity: {
    type: Number,
    required: true, 
    min: 0,
  },
  category: {
    type: String,
    required: true,
    
  },
  subcategory:{
    type: String,
    required: true,
  },
  discount:{
    type: String,
    default:'0%'
   },
   discountPrice:{
    type: String,
    default:'0'
   },
  images: [{
    type: String,
    required: true,
   }],
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
  }
 
});

// Create a Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
