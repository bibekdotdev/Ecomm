import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress
} from "@mui/material";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Loading state
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://ecomm-8piu.onrender.com/ecomm/admin/my-orders/${token}`
        );

        const sortedOrders = response.data.sort((a, b) => {
          if (a.orderStatus === "Cancelled") return 1;
          if (b.orderStatus === "Cancelled") return -1;
          if (a.orderStatus === "Delivered") return 1;
          if (b.orderStatus === "Delivered") return -1;
          return 0;
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false); // ✅ Stop loading when done
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`https://ecomm-8piu.onrender.com/ecomm/productOrder/cancel-myorder`, {
        params: {
          token,
          orderId,
        },
      });

      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );

      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling the order", error);
      alert("There was an error canceling the order. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 3, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          fontWeight: "bold",
          textAlign: "center",
          color: "#000000",
        }}
      >
        My Orders
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress size={50} color="warning" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.length > 0 ? (
            orders.map((order) => {
              let textColor = "#e65100";
              let cardColor = "#FFE0B2";

              if (order.orderStatus === "Delivered") {
                textColor = "#2E7D32";
                cardColor = "#C8E6C9";
              } else if (order.orderStatus === "Cancelled") {
                textColor = "#D32F2F";
                cardColor = "#FFCDD2";
              } else if (
                order.orderStatus !== "Delivered" &&
                order.paymentStatus !== "Paid"
              ) {
                textColor = "#D32F2F";
              }

              const price =
                order.orderItems.discountPrice || order.orderItems.price;
              const quantity = order.quantity;
              const total = (price * quantity).toFixed(2);

              return (
                <Grid item xs={12} key={order._id}>
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 2,
                      backgroundColor: cardColor,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: 2,
                      width: "100%",
                      flexWrap: "wrap",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                      image={
                        order.orderItems.images[0] ||
                        "https://via.placeholder.com/120"
                      }
                      alt={order.orderItems.name}
                    />

                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: textColor }}
                      >
                        ₹{price}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {quantity}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: "#000000" }}
                      >
                        Total: ₹{total}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flex: 2, textAlign: "left" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: textColor }}
                      >
                        {order.orderItems.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {order.orderItems.category} | Subcategory:{" "}
                        {order.orderItems.subcategory}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: textColor }}
                      >
                        Order Status: {order.orderStatus}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", color: textColor }}
                      >
                        Payment: {order.paymentMethod} | {order.paymentStatus}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Shipping to: {order.shippingAddress.fullName},{" "}
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.country} -{" "}
                        {order.shippingAddress.postalCode}
                      </Typography>

                      {order.orderStatus !== "Delivered" &&
                        order.orderStatus !== "Cancelled" && (
                          <Button
                            sx={{
                              marginTop: 2,
                              backgroundColor: "#d32f2f",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#c62828",
                              },
                            }}
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%", color: "#ff9800" }}
            >
              No orders found.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
}
