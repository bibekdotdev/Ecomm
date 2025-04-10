const express = require('express');
const routes = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/product');
const Owner = require('../models/owner.js');
const Review=require('../models/review.js');
let secretKey = process.env.SECRETKEY;
var jwt = require('jsonwebtoken');
const Order = require('../models/order.js');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'WANDERLUST_DEV',
    allowed_formats: ['png', 'jpg', 'jpeg']
  },
});

const upload = multer({ storage: storage });

routes.post('/add', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const paths = req.files.map(item => item.path);
    let { price, discount } = req.body;
    discount = parseFloat(discount);
     
    if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0 || discount > 100) {
      return res.status(400).json({ error: "Invalid price or discount" });
    }
    
    const discountAmount = (price * discount) / 100;
    const discountPrice = price - discountAmount;
    var decoded = await jwt.verify(req.body.token, secretKey);
    let v = await Owner.findOne({ email: decoded.email });
    console.log(v);
    let values = new Product({
      ...req.body,
      owner: v._id,
      images: paths,
      discount: `${discount}%`,
      discountPrice: discountPrice.toFixed(2),
    });
    
    await values.save();
    res.redirect('/allData');
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

routes.post('/personaldetails/:val', async (req, res) => {
  try {
    let { val } = req.params;
    let product = await Product.findById(val);
    res.json(product);
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

routes.get('/catagory/:catagory', async (req, res) => {
  try {
    let { catagory } = req.params;
    let cataproduct = await Product.find({ category: catagory });
    res.json(cataproduct);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

routes.get('/subcatagory/:subcatagory', async (req, res) => {
  try {
    let { subcatagory } = req.params;
    console.log(subcatagory);
    let cataproduct = await Product.find({ subcategory: subcatagory });
    res.json(cataproduct);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

routes.post('/setSearchTerm/:e', async (req, res) => {
  try {
    let { e } = req.params;
    const items = await Product.find({
      $or: [
        { name: { $regex: e, $options: "i" } },
        { category: { $regex: e, $options: "i" } },
        { subcategory: { $regex: e, $options: "i" } }
      ]
    });
    res.json(items);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Server Error" });
  }
});



routes.post('/setSearchTerm/:e', async (req, res) => {
  try {
    let { e } = req.params;
    const items = await Product.find({
      $or: [
        { name: { $regex: e, $options: "i" } },
        { category: { $regex: e, $options: "i" } },
        { subcategory: { $regex: e, $options: "i" } }
      ]
    });
    res.json(items);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

routes.post('/addReview/:id', async (req, res) => {
  let {id}=req.params;
  let { token,rating,review}=req.body;
   let rat=Number(rating);
  let user=(await Owner.findOne({email:(await jwt.verify(token,secretKey).email)})).id;
  let product=(await Product.findById(id)).id;
  let rev= await  new Review({
      rating:rat,
      review,
      product,
      user,
      createdAt:new Date().toISOString()
  })
  await rev.save();
  res.redirect(`/ecomm/product//getReviews/${id}`)
});

routes.get('/getReviews/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Product ID from URL
     const token = req.headers.token;;  // JWT token from query parameters
    console.log(token);
    // Fetch reviews for the product
    let reviews = await Review.find({ product: id }).populate('user', 'email');

    // If a token is provided, verify and check if the buyer can review
    let canReview = false;
    if (token) {
      const decodedToken = await jwt.verify(token, secretKey);
      const buyer = await Owner.findOne({ email: decodedToken.email });

      if (buyer) {
        const order = await Order.findOne({ buyer: buyer.id });

        if (order && order.orderStatus === "Delivered") {
          canReview = true;
        }
      }
    }

    console.log(canReview);
    return res.json({ reviews, canreview: canReview });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = routes;
