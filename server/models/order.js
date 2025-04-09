const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    orderItems:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
    },
    
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Credit Card", "PayPal", "Stripe"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderTime:{
        type:String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    totalPrice: {
        type: String,
        required: true,
        default: 0,
    },
  },
);
const Order= mongoose.model("Order", orderSchema);
module.exports=Order;