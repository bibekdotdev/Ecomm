import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrderCard() {
  const location = useLocation();
  const { cart } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [delayedRender, setDelayedRender] = useState(false);

  useEffect(() => {
    // const timer = setTimeout(() => {
      setDelayedRender(true);
    // }, 500);
    // return () => clearTimeout(timer);
  }, []);

  const [orderData, setOrderData] = useState({
    orderItems:
      cart?.map((item) => ({
        productId: item.orderItems.product._id,
        quantity: item.orderItems.quantity,
        price:
          item.orderItems.product.discountPrice ||
          item.orderItems.product.price,
        image: item.orderItems.product.images[0],
        productName: item.orderItems.product.name,
      })) || [],
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "COD",
    totalPrice: 0,
  });

  useEffect(() => {
    const totalPrice = orderData.orderItems.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.price),
      0
    );
    setOrderData((prev) => ({
      ...prev,
      totalPrice: totalPrice.toFixed(2),
    }));
  }, [orderData.orderItems]);

  const handleQuantityChange = (index, change) => {
    setOrderData((prev) => {
      const updatedItems = [...prev.orderItems];
      let newQuantity = updatedItems[index].quantity + change;
      if (newQuantity < 1) newQuantity = 1;

      updatedItems[index] = { ...updatedItems[index], quantity: newQuantity };

      const totalPrice = updatedItems.reduce(
        (acc, item) => acc + item.quantity * parseFloat(item.price),
        0
      );

      return {
        ...prev,
        orderItems: updatedItems,
        totalPrice: totalPrice.toFixed(2),
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("shippingAddress.")) {
      const field = name.split(".")[1];
      setOrderData((prev) => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value },
      }));
    } else {
      setOrderData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    setLoading(true);

    try {
      const response = await axios.post(
        "https://ecomm-8piu.onrender.com/ecomm/productOrder/placeOrderFromCard",
        { orderData, token }
      );
      console.log("Order Placed:", response.data);
      setTimeout(() => {
        toast.success("Order placed successfully!");
      }, 500);
      navigate("/Home");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  // === Loading Spinner View ===
  if (!delayedRender) return null;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  // === Main Form View ===
  return (
    <>
      <ToastContainer position="top-center" />
      <Container
        component={Paper}
        sx={{
          p: 3,
          mt: 3,
          maxWidth: 600,
          background: "rgba(1,1,1,0)",
          color: "#000000",
          borderRadius: "12px",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#000000", fontWeight: "bold" }}
        >
          Place Order
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Your Cart:
          </Typography>
          {orderData.orderItems.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <img
                src={item.image}
                alt={item.productName}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  marginRight: 16,
                  borderRadius: 8,
                }}
              />
              <Typography variant="body1" sx={{ flex: 1 }}>
                {item.productName} ₹
                {(item.price * item.quantity).toFixed(2)} ({item.quantity})
              </Typography>
              <IconButton onClick={() => handleQuantityChange(index, -1)}>
                <Remove />
              </IconButton>
              <Typography variant="body1" sx={{ margin: "0 8px" }}>
                {item.quantity}
              </Typography>
              <IconButton onClick={() => handleQuantityChange(index, 1)}>
                <Add />
              </IconButton>
            </Box>
          ))}

          <Typography variant="h6" gutterBottom>
            Shipping Address:
          </Typography>
          <TextField
            label="Full Name"
            name="shippingAddress.fullName"
            fullWidth
            required
            margin="normal"
            onChange={handleChange}
            sx={{ bgcolor: "#F5F5F5", borderRadius: "6px" }}
          />
          <TextField
            label="Address"
            name="shippingAddress.address"
            fullWidth
            required
            margin="normal"
            onChange={handleChange}
            sx={{ bgcolor: "#F5F5F5", borderRadius: "6px" }}
          />
          <TextField
            label="City"
            name="shippingAddress.city"
            fullWidth
            required
            margin="normal"
            onChange={handleChange}
            sx={{ bgcolor: "#F5F5F5", borderRadius: "6px" }}
          />
          <TextField
            label="Postal Code"
            name="shippingAddress.postalCode"
            fullWidth
            required
            margin="normal"
            onChange={handleChange}
            sx={{ bgcolor: "#F5F5F5", borderRadius: "6px" }}
          />
          <TextField
            label="Country"
            name="shippingAddress.country"
            fullWidth
            required
            margin="normal"
            onChange={handleChange}
            sx={{ bgcolor: "#F5F5F5", borderRadius: "6px" }}
          />

          {/* Payment Method Fixed as COD */}
          <TextField
            label="Payment Method"
            name="paymentMethod"
            fullWidth
            disabled
            margin="normal"
            value="Cash on Delivery (COD)"
            sx={{ bgcolor: "#F5F5F5", borderRadius: "6px" }}
          />

          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
            Total Price: ₹{orderData.totalPrice}
          </Typography>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              width: "100%",
              marginTop: "20px",
            }}
          >
            Submit Order
          </Button>
        </form>
      </Container>
    </>
  );
}
