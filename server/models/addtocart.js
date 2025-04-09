const mongoose = require("mongoose");

const addtocartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner", // Assuming you have a separate 'Owner' model for the buyer
      required: true,
    },
    orderItems: 
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Assuming you have a 'Product' model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Minimum quantity of 1
        },
      },
    
  },

);

const AddToCart = mongoose.model("AddToCart", addtocartSchema);

module.exports = AddToCart;
