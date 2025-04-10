import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Card, CardContent, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddToCart() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [delayRender, setDelayRender] = useState(false);
  const token = Cookies.get('token');
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://ecomm-8piu.onrender.com/ecomm/productOrder/Cart', { token });
      setCart(response.data);
      calculateTotal(response.data);
      // toast.success("Cart loaded successfully!");
      setDelayRender(true);
      // setTimeout(() => setDelayRender(true), 500);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // toast.error("Failed to load cart.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleIncrease = async (productId) => {
    // setLoading(true);
    try {
      await axios.post('https://ecomm-8piu.onrender.com/ecomm/productOrder/IncreaseQuantity', { token, productId });
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.orderItems.product._id === productId
            ? { ...item, orderItems: { ...item.orderItems, quantity: item.orderItems.quantity + 1 } }
            : item
        );
        calculateTotal(updatedCart);
        return updatedCart;
      });
      // toast.success("Quantity increased!");
    } catch (err) {
      console.error(err);
      // toast.error("Failed to increase quantity.");
    }
    // setTimeout(() => setLoading(false), 500);
  };

  const handleDecrease = async (productId) => {
    // setLoading(true);
    try {
      await axios.post('https://ecomm-8piu.onrender.com/ecomm/productOrder/DecreaseQuantity', { token, productId });
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.orderItems.product._id === productId && item.orderItems.quantity > 1
            ? { ...item, orderItems: { ...item.orderItems, quantity: item.orderItems.quantity - 1 } }
            : item
        );
        calculateTotal(updatedCart);
        return updatedCart;
      });
      // toast.success("Quantity decreased!");
    } catch (err) {
      console.error(err);
      // toast.error("Failed to decrease quantity.");
    }
    // setTimeout(() => setLoading(false), 500);
  };

  const handleRemove = async (productId) => {
    setLoading(true);
    try {
      await axios.post('https://ecomm-8piu.onrender.com/ecomm/productOrder/removeItem', { token, productId });
      toast.success("Item removed!");
      // setTimeout(async () => {
        await fetchCart();
      // }, 500);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item.");
    }
    setLoading(false);
  };

  const calculateTotal = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      total += parseFloat(item.orderItems.product.discountPrice) * item.orderItems.quantity;
    });
    setTotalPrice(total.toFixed(2));
  };

  const handleOrder = () => {
    // toast.success("Order placed!");
    // setTimeout(() => {
      navigate('/ordercard', { state: { cart } });
      setCart([]);
    // }, 500);
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <Typography variant="h3" gutterBottom align="center" style={styles.header}>
        Your Shopping Cart
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : !delayRender ? (
        <></>
      ) : cart.length === 0 ? (
        <Typography variant="h5" color="textSecondary" align="center">
          Your cart is empty.
        </Typography>
      ) : (
        cart.map((item, index) => (
          <Card style={styles.card} key={index}>
            <CardContent style={styles.cardContent}>
              <Box style={styles.productRow}>
                <img
                  src={item.orderItems.product.images[0]}
                  alt={item.orderItems.product.name}
                  style={styles.productImage}
                />
                <div style={styles.productDetails}>
                  <Typography variant="h6" component="h2" style={styles.productName}>
                    {item.orderItems.product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={styles.productDescription}>
                    {item.orderItems.product.description}
                  </Typography>
                  <Typography variant="body1" color="textPrimary" style={styles.productPrice}>
                    ${item.orderItems.product.discountPrice * item.orderItems.quantity}
                  </Typography>
                </div>

                <Box style={styles.quantityBox}>
                  <IconButton onClick={() => handleDecrease(item.orderItems.product._id)}>
                    <Button>-</Button>
                  </IconButton>
                  <Typography variant="body2" color="textPrimary" style={styles.productQuantity}>
                    {item.orderItems.quantity}
                  </Typography>
                  <IconButton onClick={() => handleIncrease(item.orderItems.product._id)}>
                    <Button>+</Button>
                  </IconButton>
                </Box>

                <IconButton onClick={() => handleRemove(item.orderItems.product._id)} style={styles.deleteIcon}>
                  <FaTrashAlt />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {!loading && delayRender && cart.length > 0 && (
        <Card style={styles.summaryCard}>
          <CardContent>
            <Typography variant="h6" component="h2" style={styles.summaryTitle}>
              Total Price: ${totalPrice}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={styles.orderButton}
              onClick={handleOrder}
            >
              Place Order
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minHeight: '100vh',
  },
  header: {
    color: '#2c3e50',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'left',
    marginBottom: '15px',
  },
  cardContent: {
    padding: '10px',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginRight: '20px',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  productDescription: {
    marginBottom: '10px',
    color: '#555',
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#27ae60',
  },
  quantityBox: {
    display: 'flex',
    alignItems: 'center',
  },
  productQuantity: {
    fontWeight: 'bold',
    margin: '0 10px',
  },
  deleteIcon: {
    color: '#e74c3c',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  summaryCard: {
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginTop: '20px',
    textAlign: 'center',
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    color: '#34495e',
  },
  orderButton: {
    marginTop: '15px',
    padding: '12px',
    fontSize: '1.2rem',
    backgroundColor: '#3498db',
  },
};
