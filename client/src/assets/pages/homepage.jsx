import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardMedia, CardContent, Typography, Button, Container, Grid, TextField, Backdrop, CircularProgress } from "@mui/material";
import { FaLaptop, FaTshirt, FaCouch, FaSprayCan, FaBaby, FaShoppingBag } from "react-icons/fa";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  let location = useLocation();
  let it = location.state?.alldata;
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  let navigate = useNavigate();
  const [calleffect, setcalleffect] = useState(false);
  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/allData");
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [calleffect]);

  useEffect(() => {
    if (it) {
      setItems(it);
    }
  }, [it]);

  async function personalDetail(val) {
    try {
      setLoading(true);
      let returnValue = await axios.post(`http://localhost:8080/ecomm/product/personaldetails/${val}`);
      navigate("/personaldetails", { state: { personaldata: returnValue.data } });
      toast.success("Success! Your order is placed.");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching personal details:", error);
      setLoading(false);
    }
  }

  async function fetchCategoryData(category) {
    setLoading(true);
    navigate('/category', { state: { category } });
    setLoading(false);
  }

  async function scarchValues(e) {
    setSearchTerm(e);
    if (e) {
      try {
        // setLoading(true);
        let returnValue = await axios.post(`http://localhost:8080/ecomm/product/setSearchTerm/${e}`);
        setItems(returnValue.data);
        // setLoading(false);
      } catch (error) {
        console.error("Search error:", error);
        // setLoading(false);
      }
    } else {
      setcalleffect(!calleffect);
    }
  }

  const categoryIcons = {
    electronics: FaLaptop,
    fashion: FaTshirt,
    home: FaCouch,
    beauty: FaSprayCan,
    kids: FaBaby,
    accessories: FaShoppingBag,
  };

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Search Bar */}
      <div className="search-bar-container fixed-top shadow-sm p-2" style={{ backgroundColor: "#ffffff" }}>
        <Container-sm className="row justify-content-center align-items-center">
          <div className="d-flex justify-content-center align-items-center justify-content-center col-md-8">
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              className="w-100"
              value={searchTerm}
              onChange={(e) => scarchValues(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: "4px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#000000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Container-sm>
      </div>

      <div style={{ marginTop: "80px" }}></div>

      <ToastContainer />
      <Container>
        <Grid container spacing={3} className="mt-3">
          {Object.keys(categoryIcons).map((category) => {
            const IconComponent = categoryIcons[category];
            return (
              <Grid item xs={6} sm={4} md={2} key={category}>
                <Card
                  className="shadow-sm text-center"
                  style={{
                    cursor: "pointer",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #000000",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    transition: "0.3s",
                    textAlign: "center",
                    backgroundColor: selectedCategory === category ? "#0a198a" : "#f0f8ff",
                  }}
                  onClick={() => {
                    setSelectedCategory(category);
                    fetchCategoryData(category);
                  }}
                  onMouseEnter={() => {
                    setSelectedCategory(category);
                  }}
                  onMouseLeave={() => {
                    setSelectedCategory(null);
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#FF5722",
                      color: "white",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <IconComponent size={50} color={selectedCategory === category ? "white" : "#000000"} />
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: selectedCategory === category ? "white" : "#000000" }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Product List */}
      <Container>
        <Grid container spacing={3} className="mt-3">
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card
                className="shadow-sm"
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
                    className="mt-2"
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
      </Container>
    </>
  );
}
