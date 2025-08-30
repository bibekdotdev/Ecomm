const express = require("express");
const routes = express.Router();
const cloudinary = require('cloudinary').v2;
const jwt = require("jsonwebtoken");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");

const Product = require('../models/product');
const Owner = require('../models/owner');
const Order = require("../models/order");


const secretKey = process.env.SECRETKEY;


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


routes.post("/yourproduct", async (req, res) => {
    try {
        let details = jwt.verify(req.body.token, secretKey);
        let owner = await Owner.findOne({ email: details.email });

        if (!owner) return res.status(404).json({ error: "Owner not found" });

        let products = await Product.find({ owner: owner._id });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.delete('/deleteproduct/:id', async (req, res) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        let ownerProducts = await Product.find({ owner: product.owner });
        res.json(ownerProducts);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

routes.get('/product/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.put('/edit/:id', upload.array("images", 10), async (req, res) => {
    try {
        let decoded = jwt.verify(req.body.token, secretKey);
        let owner = await Owner.findOne({ email: decoded.email });

        if (!owner) return res.status(404).json({ error: "Owner not found" });

        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        const imagePaths = req.files?.map(file => file.path) || [];
        let { name, description, price, discount, quantity, category, subcategory } = req.body;

        price = parseFloat(price);
        discount = parseFloat(discount);

        if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0 || discount > 100) {
            return res.status(400).json({ error: "Invalid price or discount" });
        }

        const discountPrice = price - (price * discount) / 100;

        product.set({
            name,
            description,
            price,
            discount: `${discount}%`,
            discountPrice: discountPrice.toFixed(2),
            quantity,
            category,
            subcategory,
            owner: owner._id,
            images: imagePaths.length > 0 ? imagePaths : product.images
        });

        await product.save();
        res.json({ message: "Product updated successfully", product });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.post('/personaldetails/:val', async (req, res) => {
    try {
        let product = await Product.findById(req.params.val);
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.get('/vieworder/:token', async (req, res) => {
   
    try {
        let { token } = req.params;
        let details = jwt.verify(token, secretKey);
        let owner = await Owner.findOne({ email: details.email });

        if (!owner) return res.status(404).json({ error: "Owner not found" });

        let orders = await Order.find({ seller: owner._id })
            .populate('buyer', 'name email')
            .populate('seller', 'name email');

        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.put('/updateorder/:id', async (req, res) => {
    try {
        let { orderStatus, paymentStatus } = req.body;
        let order = await Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus }, { new: true });

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

routes.delete('/deleteorder/:id', async (req, res) => {
    try {
        let order = await Order.findByIdAndUpdate(req.params.id, { seller: null }, { new: true });

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json({ message: "Order deleted successfully", order });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.get('/my-orders/:id', async (req, res) => {
    try {
        let email = jwt.verify(req.params.id, secretKey);
        let buyer = await Owner.findOne({ email: email.email });

        if (!buyer) return res.status(404).json({ error: "Buyer not found" });

        let orders = await Order.find({ buyer: buyer._id }).populate('orderItems');
        console.log(orders);
        res.json(orders);
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


routes.post('/islogin/:token', async (req, res) => {
    try {
        jwt.verify(req.params.token, secretKey);
        res.json(true);
    } catch (error) {
        res.json(false);
    }
});

module.exports = routes;
