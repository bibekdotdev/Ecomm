const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/order");
const Owner = require("../models/owner");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const Tempdata=require("../models/temdata.js")
const nodemailer = require("nodemailer");
const secretKey = process.env.SECRETKEY;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.PASS_KEY,
  },
});
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
      await firstProduct.updateOne({ $set: { quantity: firstProduct.quantity - 1 } });
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

routes.post("/tempup", async (req, res) => {
  let { username, email, password } = req.body;
  //  await Owner.deleteMany({});
  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Please provide username, email, and password.' });
  }
  const existingUser = await Owner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }
  try {
 
    let otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    const mailOptions = {
      from: 'bibekjana68@gmail.com', 
      to: email,                   
      subject: 'Your OTP for Signup', 
      text: `Your OTP for account signup is: ${otp}\n\nThis OTP is valid for the next 10 minutes. Please do not share it with anyone.`
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: ", info.response);

    const tempData = new Tempdata({
      name: username,
      email,
      password,
      otp
    });

    let v=await tempData.save();
    console.log(v.otp);
    console.log('Temporary data saved.');


    res.status(200).json({ message: 'OTP sent to your email. Please verify.',email:v._id });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
});

routes.post("/signup", async (req, res, next) => {
  try {
    const { otp, id } = req.body;
    console.log(otp, id);


    let allTempData = await Tempdata.findById(id);
    console.log(allTempData)

    if (!allTempData) {
      return res.status(404).json({ error: "No temporary data found for this ID" });
    }

    const { name, password, email, otp: storedOtp, createdAt } = allTempData;

    console.log(otp,storedOtp);
    if (otp !== storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

 
    const otpExpirationTime = 10 * 60 * 1000;
    if (Date.now() - new Date(createdAt).getTime() > otpExpirationTime) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

 
    const newOwner = new Owner({
      name,
      email,
      password: hashedPassword,
    });

    let v= await newOwner.save();
    console.log(v);
     
    const token = await jwt.sign({ email }, secretKey, { expiresIn: "7d" });
    await Tempdata.deleteMany({});
    res.status(200).json({ token });

    
  } catch (error) {
    console.error("Unexpected error during signup:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

routes.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let man = await Owner.findOne({ email });
    if (!man) {
      console.log("Email not found");
      return res.status(400).json({ error: "Invalid email or password" });
    }
    let pass = man.password;
    bcrypt.compare(password, pass, async function (err, result) {
      if (err) return next(err);
      if (result) {
        console.log("Authenticated");
        const token = await jwt.sign({ email }, secretKey, { expiresIn: "7d" });
        res.json(token);
      } else {
        console.log("Incorrect password");
        res.status(400).json({ error: "Invalid email or password" });
      }
    });
  } catch (error) {
    console.error("Unexpected error during login:", error);
    res.status(500).json({ error: "Unexpected Server Error" });
  }
});

routes.post("/logout", async (req, res, next) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = routes;
