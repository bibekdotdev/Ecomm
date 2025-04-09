import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button, Container, Typography, Paper, IconButton, CircularProgress } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const OrderForm = () => {
  const location = useLocation();
  const orderProduct = location.state?.orderProduct;
  const navigate = useNavigate();
  const initialPrice = Number(orderProduct?.discountPrice || orderProduct?.price || 0).toFixed(2);

  const [orderData, setOrderData] = useState({
    orderItems: [{
      productId: orderProduct?._id || "",
      quantity: 1,
      price: initialPrice,
      image: orderProduct?.image || ""
    }],
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "COD",
    totalPrice: initialPrice,
  });

  const [loading, setLoading] = useState(false);
  const [renderForm, setRenderForm] = useState(true);

  const handleQuantityChange = (index, change) => {
    setOrderData((prev) => {
      const updatedItems = [...prev.orderItems];
      let newQuantity = updatedItems[index].quantity + change;
      if (newQuantity < 1) newQuantity = 1;

      updatedItems[index] = { ...updatedItems[index], quantity: newQuantity };

      return {
        ...prev,
        orderItems: updatedItems,
        totalPrice: updatedItems
          .reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0)
          .toFixed(2),
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
    let token = Cookies.get("token");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/ecomm/productOrder/placedOrder", {
        orderData,
        token,
      });

      setTimeout(() => {
        toast.success("Order placed successfully!");
      }, 500);
      setRenderForm(false);
      setTimeout(() => setRenderForm(true), 500);
      navigate('/home');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {renderForm && (
        <Container
          component={Paper}
          sx={{
            p: 3,
            mt: 3,
            maxWidth: 600,
            bgcolor: 'rgba(1,1,1,0)',
            color: "#000000",
            borderRadius: "12px",
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#000000", fontWeight: "bold" }}>
            Place Order
          </Typography>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              {orderData.orderItems[0].image && (
                <img src={orderData.orderItems[0].image} alt="Product" width="80px" height="80px" style={{ borderRadius: "10px" }} />
              )}
              <Typography variant="h6" sx={{ color: "#000000", fontWeight: "bold" }}>
                {orderProduct?.name || "Product"}
              </Typography>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <IconButton
                onClick={() => handleQuantityChange(0, -1)}
                disabled={orderData.orderItems[0].quantity === 1}
                sx={{ color: "#000000" }}
              >
                <Remove />
              </IconButton>

              <Typography sx={{ fontWeight: "bold", color: "#000000" }}>{orderData.orderItems[0].quantity}</Typography>

              <IconButton onClick={() => handleQuantityChange(0, 1)} sx={{ color: "#000000" }}>
                <Add />
              </IconButton>
            </div>

            <Typography variant="h6" sx={{ color: "#000000" }}>
              Discounted Price per item: ${orderData.orderItems[0].price}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2, color: "#000000" }}>
              Total Price: ${orderData.totalPrice}
            </Typography>

            <TextField
              label="Full Name"
              name="shippingAddress.fullName"
              fullWidth
              required
              margin="normal"
              onChange={handleChange}
              sx={{ bgcolor: "#F5F5F5", borderRadius: "6px", color: "#000000" }}
            />
            <TextField
              label="Address"
              name="shippingAddress.address"
              fullWidth
              required
              margin="normal"
              onChange={handleChange}
              sx={{ bgcolor: "#F5F5F5", borderRadius: "6px", color: "#000000" }}
            />
            <TextField
              label="City"
              name="shippingAddress.city"
              fullWidth
              required
              margin="normal"
              onChange={handleChange}
              sx={{ bgcolor: "#F5F5F5", borderRadius: "6px", color: "#000000" }}
            />
            <TextField
              label="Postal Code"
              name="shippingAddress.postalCode"
              fullWidth
              required
              margin="normal"
              onChange={handleChange}
              sx={{ bgcolor: "#F5F5F5", borderRadius: "6px", color: "#000000" }}
            />
            <TextField
              label="Country"
              name="shippingAddress.country"
              fullWidth
              required
              margin="normal"
              onChange={handleChange}
              sx={{ bgcolor: "#F5F5F5", borderRadius: "6px", color: "#000000" }}
            />

            <TextField
              label="Payment Method"
              name="paymentMethod"
              fullWidth
              disabled
              margin="normal"
              value="Cash on Delivery (COD)"
              sx={{ bgcolor: "#F5F5F5", borderRadius: "6px", color: "#000000" }}
            />

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
              {loading ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Submit Order"}
            </Button>
          </form>
        </Container>
      )}
    </>
  );
};

export default OrderForm;
