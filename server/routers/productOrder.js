const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/order");
const Owner = require("../models/owner");
const AddToCart=require('../models/addtocart');
const secretKey = process.env.SECRETKEY;

routes.post("/placedOrder", async (req, res) => {
  try {
    try {
      const { orderData, token } = req.body;
       
      if (!orderData || !Array.isArray(orderData.orderItems) || orderData.orderItems.length === 0) {
        return res.status(400).json({ error: "Invalid order items" });
      }


      const decoded = jwt.verify(token, secretKey);
      const buyer = await Owner.findOne({ email: decoded.email });

      if (!buyer) {
        return res.status(400).json({ error: "Invalid buyer details" });
      }

   
      const firstProductId = orderData.orderItems[0].productId;
      if (!mongoose.Types.ObjectId.isValid(firstProductId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }


      const firstProduct = await Product.findById(firstProductId).populate("owner");

      if (!firstProduct || !firstProduct.owner) {
        return res.status(400).json({ error: "Seller not found" });
      }

      const seller = firstProduct.owner;


      if (firstProduct.quantity < orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0)) {
        return res.status(400).json({
          error: `Requested quantity (${orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0)}) exceeds available stock (${firstProduct.quantity}). Please adjust your order accordingly.`
        });
      }
      const newOrder = new Order({
        buyer: buyer._id,
        seller: seller._id,
        shippingAddress: orderData.shippingAddress,
        orderItems: orderData.orderItems[0].productId,
        paymentMethod: orderData.paymentMethod,
        totalPrice: orderData.totalPrice,
        quantity: orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        orderTime: new Date().toISOString(),
      });
      console.log(newOrder);

      await newOrder.save();
      await firstProduct.updateOne({ $set: { quantity: firstProduct.quantity - (orderData.orderItems.reduce((sum, item) => sum + item.quantity, 0)) } });

      await firstProduct.save();
      res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ error: "Server Error" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected Server Error" });
  }
});
routes.post("/addToCart/:e", async (req, res) => {
  try {
    let { token } = req.body;
    const decoded = jwt.verify(token, secretKey);
    const buyer = await Owner.findOne({ email: decoded.email });
    let product = await Product.findById(req.params.e);
    let v=await AddToCart.find({ buyer: buyer.id,'orderItems.product':product.id });
    console.log(v);
    if(v.length!=0){
      res.status(200).json({ message: "its alrady in the card" });
    }
    else{
      let addCart = await new AddToCart({
        buyer: buyer,
        orderItems: {
          product: product,
          quantity: 1,
        },
      });
  

      await addCart.save();
      
   
      res.status(200).json({ message: "Product added to cart successfully!" });
    }
    
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "An error occurred while adding to the cart", error: error.message });
  }
});

routes.post("/Cart", async (req, res) => {
  try {
    let { token } = req.body;
    const decoded = await jwt.verify(token, secretKey);
    let buyer = await Owner.findOne({ email: decoded.email });

    let allorder = await AddToCart.find({ buyer: buyer.id }).populate('orderItems.product');
    res.json(allorder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the cart", error: error.message });
  }
});


routes.post("/removeItem", async (req, res) => {
  try {
    let { token, productId } = req.body;
    const decoded = await jwt.verify(token, secretKey);
    let buyer = await Owner.findOne({ email: decoded.email });

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    let allorder = await AddToCart.findOneAndDelete({
      buyer: buyer.id,
      'orderItems.product': productId,
    });

    if (!allorder) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    res.status(200).json({ message: "Item removed from cart successfully" });

  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "An error occurred while removing the item", error: error.message });
  }
});


routes.post("/IncreaseQuantity", async (req, res) => {
  try {
    let { token, productId } = req.body;
    const decoded = await jwt.verify(token, secretKey);
    let buyer = await Owner.findOne({ email: decoded.email });

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    let allorder = await AddToCart.findOne({
      buyer: buyer.id,
      'orderItems.product': productId,
    });
    
    if (!allorder) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
   await allorder.updateOne({$set:{'orderItems.quantity':(allorder.orderItems.quantity+1)}})
    console.log(allorder);

    res.status(200).json({ message: "Item removed from cart successfully" });

  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "An error occurred while removing the item", error: error.message });
  }
});


routes.post("/DecreaseQuantity", async (req, res) => {
  try {
    let { token, productId } = req.body;
    const decoded = await jwt.verify(token, secretKey);
    let buyer = await Owner.findOne({ email: decoded.email });

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    let allorder = await AddToCart.findOne({
      buyer: buyer.id,
      'orderItems.product': productId,
    });
    
    if (!allorder) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }
    if(allorder.orderItems.quantity>1){
      await allorder.updateOne({$set:{'orderItems.quantity':(allorder.orderItems.quantity-1)}})
    }
    res.status(200).json({ message: "Item removed from cart successfully" });

  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "An error occurred while removing the item", error: error.message });
  }
});

routes.post("/placeOrderFromCard", async (req, res) => {
  try {
    let { orderData, token } = req.body;
    const decoded = await jwt.verify(token, secretKey);
    let buyer = await Owner.findOne({ email: decoded.email });
    
    for (let products of orderData.orderItems) {
      let product = await Product.findById(products.productId);
    
      if (product.quantity < products.quantity) {
        return res.status(400).json({
          error: `We're sorry, your requested quantity (${products.quantity}) for "${product.name}" exceeds the available stock (${product.quantity}). Please reduce the quantity to proceed with your order.`
        });
      }
    }
    
    orderData.orderItems.map(async (products) => {
      let product = await Product.findById(products.productId);
      
      const newOrder = new Order({
        buyer: buyer._id,
        seller: product.owner,
        shippingAddress: orderData.shippingAddress,
        orderItems: products.productId,
        paymentMethod: orderData.paymentMethod,
        totalPrice: String((product.price) * products.quantity),
        quantity: products.quantity,
        orderTime: new Date().toISOString(),
      });
      await product.updateOne({ $set: { quantity:product.quantity -  products.quantity } });

      await product.save();
      await newOrder.save();
    });
    
    res.status(200).send({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while placing the order.', error: error.message });
  }
});


routes.delete("/cancel-myorder", async (req, res) => {
  try {
 
    const { token, orderId } = req.query;  


    if (!token || !orderId) {
      return res.status(400).json({ message: 'Token and Order ID are required' });
    }

   



    const decoded = await jwt.verify(token, secretKey);

 
    const buyer = await Owner.findOne({ email: decoded.email });
 

    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const result = await Order.findOne({ _id:orderId });
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: 'Order not found' });
    }


    result.orderStatus = 'Cancelled';
    await result.save(); 

 
    res.status(200).json({ message: 'Order cancelled successfully' });

  } catch (error) {
 
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = routes;
