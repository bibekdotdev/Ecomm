const mongoose = require("mongoose");

const addtocartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner", 
      required: true,
    },
    orderItems: 
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    
  },

);

const AddToCart = mongoose.model("AddToCart", addtocartSchema);

module.exports = AddToCart;
