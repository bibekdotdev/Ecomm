import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, CardMedia, CardContent, Typography, Button, Container, Grid, Box, CircularProgress
} from "@mui/material";
import {
  FaLaptop, FaMobileAlt, FaHeadphones, FaTabletAlt, FaCamera,
  FaTshirt, FaUserTie, FaVest, FaFemale, FaUser,
  FaCouch, FaChair, FaTable, FaBed, FaWindowMaximize,
  FaMagic, FaSprayCan, FaWind, FaTint,
  FaBaby, FaBook, FaChild, FaAppleAlt,
  FaGlasses, FaClock, FaBriefcase, FaWallet, FaShoePrints
} from "react-icons/fa";

export default function Category() {
  let location = useLocation();
  let it = location.state?.alldata;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  let navigate = useNavigate();
  let catagory = location.state.category;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(`https://ecomm-8piu.onrender.com/ecomm/product/catagory/${catagory}`);
        if (response.data && response.data.length !== 0) {
          setItems(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [catagory]);

  useEffect(() => {
    if (it) {
      setItems(it);
    }
  }, [it]);

  const categoryIcons = {
    electronics: [
      { name: "Laptop", icon: FaLaptop },
      { name: "Smartphone", icon: FaMobileAlt },
      { name: "Headphones", icon: FaHeadphones },
      { name: "Tablet", icon: FaTabletAlt },
      { name: "Camera", icon: FaCamera },
    ],
    fashion: [
      { name: "Shirt", icon: FaTshirt },
      { name: "Jeans", icon: FaUserTie },
      { name: "Jacket", icon: FaVest },
      { name: "Dress", icon: FaFemale },
      { name: "Kurta", icon: FaUser },
    ],
    home: [
      { name: "Sofa", icon: FaCouch },
      { name: "Chair", icon: FaChair },
      { name: "Table", icon: FaTable },
      { name: "Bed", icon: FaBed },
      { name: "Curtain", icon: FaWindowMaximize },
    ],
    beauty: [
      { name: "Makeup Kit", icon: FaMagic },
      { name: "Perfume", icon: FaSprayCan },
      { name: "Hair Dryer", icon: FaWind },
      { name: "Shampoo", icon: FaTint },
    ],
    kids: [
      { name: "Toys", icon: FaBaby },
      { name: "Books", icon: FaBook },
      { name: "Diapers", icon: FaChild },
      { name: "Baby Food", icon: FaAppleAlt },
    ],
    accessories: [
      { name: "Sunglasses", icon: FaGlasses },
      { name: "Watch", icon: FaClock },
      { name: "Bags", icon: FaBriefcase },
      { name: "Wallet", icon: FaWallet },
      { name: "Shoes", icon: FaShoePrints },
    ],
  };

  async function personalDetail(val) {
    try {
      let returnValue = await axios.post(`https://ecomm-8piu.onrender.com/ecomm/product/personaldetails/${val}`);
      navigate("/personaldetails", { state: { personaldata: returnValue.data } });
    } catch (error) {
      console.error("Error fetching personal details:", error);
    }
  }

  async function fetchCategoryData(category) {
    try {
      setLoading(true);
      const response = await axios.get(`https://ecomm-8piu.onrender.com/ecomm/product/subcatagory/${category}`);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ marginTop: "80px" }}></div>
      <Container>
        <Box display="flex" justifyContent="center">
          <Grid container spacing={3} justifyContent="center">
            {categoryIcons[catagory]?.map((categoryItem, index) => {
              const IconComponent = categoryItem.icon;
              return (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Card
                    style={{
                      cursor: "pointer",
                      padding: "20px",
                      borderRadius: "12px",
                      transition: "0.3s",
                      textAlign: "center",
                      backgroundColor: selectedCategory === categoryItem.name ? "#0a198a" : "#f0f8ff",
                      border: selectedCategory === categoryItem.name ? "2px solid #000000" : "2px solid #000000",
                      boxShadow: selectedCategory === categoryItem.name ? "0px 4px 15px rgba(0, 0, 0, 0.2)" : "none",
                    }}
                    onClick={() => {
                      setSelectedCategory(categoryItem.name);
                      fetchCategoryData(categoryItem.name);
                    }}
                  >
                    <IconComponent size={50} color={selectedCategory === categoryItem.name ? "white" : "#333333"} />
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: selectedCategory === categoryItem.name ? "white" : "#333333" }}>
                      {categoryItem.name}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>

      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={50} thickness={5} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <Card
                  onClick={() => personalDetail(item._id)}
                  style={{
                    cursor: "pointer",
                    transition: "0.3s",
                    borderRadius: "12px",
                    border: "2px solid #000000",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#fff",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.images[0]}
                    alt={item.name}
                    style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                  />
                  <CardContent sx={{ textAlign: "center", padding: "16px" }}>
                    <Typography variant="h6" fontWeight="bold" color="#333333" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Price: <span style={{ textDecoration: "line-through", color: "#b0b0b0" }}>₹{item.price}</span>{" "}
                      <span style={{ color: "#333333", fontSize: "1.2rem" }}>₹{item.discountPrice}</span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "#ff5722",
                        color: "white",
                        borderRadius: "10px",
                        display: "inline-block",
                        padding: "5px 10px",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        marginTop: "8px",
                      }}
                    >
                      {item.discount} OFF
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        backgroundColor: "#ff5722",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor: "#e64a19",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
