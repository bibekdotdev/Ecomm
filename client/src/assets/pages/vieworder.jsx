import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Modal, Box, TextField, MenuItem, CircularProgress
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import PersonalDetails from "./personalDetails";

export default function ViewOrders() {
    const [orders, setOrders] = useState([]);
    const token = Cookies.get("token");

    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState("");
    const [updatedPayment, setUpdatedPayment] = useState("");
    const [loading, setLoading] = useState(true); // loading state

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true); // start loading
            try {
                let response = await axios.get(`https://ecomm-8piu.onrender.com/ecomm/admin/vieworder/${token}`);
                const sortedOrders = response.data.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false); // end loading
            }
        }
        fetchOrders();
    }, [token, open]);

    const handleOpen = (order) => {
        setSelectedOrder(order);
        setUpdatedStatus(order.orderStatus);
        setUpdatedPayment(order.paymentStatus);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        handleUpdateOrder();
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;

        const updatedOrder = {
            orderStatus: updatedStatus,
            paymentStatus: updatedPayment
        };

        try {
            await axios.put(`https://ecomm-8piu.onrender.com/ecomm/admin/updateorder/${selectedOrder._id}`, updatedOrder);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === selectedOrder._id ? { ...order, ...updatedOrder } : order
                )
            );
            setOpen(false);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`https://ecomm-8piu.onrender.com/ecomm/admin/deleteorder/${orderId}`);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    return (
        <div>
            <br /><br />
            <h2 className="text-center mb-4" style={{ color: "#000000", fontWeight: "bold" }}>
                Orders for Your Products
            </h2>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <CircularProgress />
                </div>
            ) : orders.length === 0 ? (
                <p className="text-center" style={{ color: "#757575" }}>No orders found.</p>
            ) : (
                <TableContainer component={Paper} style={{ backgroundColor: "#FFFFFF", color: "#000000" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Order ID", "Buyer", "Total Price", "Quantity", "Payment Method", "Payment", "Order Status", "Shipping Address", "Order Time", "Actions", ""].map((header) => (
                                    <TableCell key={header} style={{ color: "#000000", fontWeight: "bold" }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id} style={{ backgroundColor: "#F5F5F5" }}>
                                    <TableCell style={{ color: "#000000" }}>{order._id.substring(0, 8)}...</TableCell>
                                    <TableCell style={{ color: "#000000" }}>{order.buyer?.email || "N/A"}</TableCell>
                                    <TableCell style={{ color: "#000000" }}>₹{parseFloat(order.totalPrice).toFixed(2)}</TableCell>
                                    <TableCell style={{ color: "#000000" }}>{order.quantity}</TableCell>
                                    <TableCell style={{ color: "#000000" }}>{order.paymentMethod}</TableCell>

                                    {/* Payment Status Badge */}
                                    <TableCell>
                                        <span className="px-2 py-1 rounded" style={{
                                            backgroundColor: order.paymentStatus === "Pending" ? "#9E9E9E" : "#4CAF50",
                                            color: "#FFFFFF",
                                            fontWeight: "bold",
                                        }}>
                                            {order.paymentStatus}
                                        </span>
                                    </TableCell>

                                    {/* Order Status Badge */}
                                    <TableCell>
                                        <span className="px-2 py-1 rounded" style={{
                                            backgroundColor:
                                                order.orderStatus === "Pending" ? "#9E9E9E" :
                                                    order.orderStatus === "Processing" || order.orderStatus === "Shipped" ? "#1976D2" :
                                                        order.orderStatus === "Delivered" ? "#4CAF50" :
                                                            order.orderStatus === "Cancelled" ? "#D32F2F" : "#9E9E9E",
                                            color: "#FFFFFF",
                                            fontWeight: "bold",
                                        }}>
                                            {order.orderStatus}
                                        </span>
                                    </TableCell>

                                    <TableCell style={{ color: "#000000" }}>
                                        {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city}
                                    </TableCell>
                                    <TableCell style={{ color: "#000000" }}>{new Date(order.orderTime).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" onClick={() => handleOpen(order)}
                                            style={{ backgroundColor: "#1976D2", color: "#FFFFFF", marginRight: "8px" }}>
                                            Update
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" onClick={() => handleDeleteOrder(order._id)}
                                            style={{ backgroundColor: "#D32F2F", color: "#FFFFFF" }}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Modal open={open} onClose={handleClose}>
                <Box sx={{ width: 400, bgcolor: "#FFFFFF", color: "#000000", p: 3, m: "auto", mt: 5, borderRadius: 2 }}>
                    <h3 className="text-center">Update Order</h3>
                    <TextField
                        select
                        label="Order Status"
                        fullWidth
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        sx={{ mt: 2, backgroundColor: "#FAFAFA", color: "#000000" }}
                    >
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Payment Status"
                        fullWidth
                        value={updatedPayment}
                        onChange={(e) => setUpdatedPayment(e.target.value)}
                        sx={{ mt: 2, backgroundColor: "#FAFAFA", color: "#000000" }}
                    >
                        {["Pending", "Paid"].map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </TextField>
                    <Button onClick={handleClose} variant="contained" fullWidth sx={{ mt: 3, backgroundColor: "#1976D2", color: "#FFFFFF" }}>Save Changes</Button>
                </Box>
            </Modal>
        </div>
    );
}
