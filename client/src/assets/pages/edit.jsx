import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    category: "",
    subcategory: "",
    images: [],
    error: "",
  });

  const categoryOptions = {
    electronics: ["Laptop", "Smartphone", "Headphones", "Tablet", "Camera"],
    fashion: ["Shirt", "Jeans", "Jacket", "Dress", "Kurta"],
    home: ["Sofa", "Chair", "Table", "Bed", "Curtain"],
    beauty: ["Makeup Kit", "Perfume", "Hair Dryer", "Shampoo"],
    kids: ["Toys", "Books", "Diapers", "Baby Food", "Shirt"],
    accessories: ["Sunglasses", "Watch", "Bags", "Wallet", "Shoes"],
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`https://ecomm-8piu.onrender.com/ecomm/admin/product/${id}`);
        const { name, description, price, discount, quantity, category, subcategory, images } = response.data;

        setProduct({
          name,
          description,
          price,
          discount: discount.replace("%", ""),
          quantity,
          category,
          subcategory,
          images: [],
          error: "",
        });
      } catch (error) {
        console.error("Error fetching product", error);
        toast.error("Failed to fetch product data");
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    setProduct({
      ...product,
      category: e.target.value,
      subcategory: "",
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = product.images.length + files.length;

    if (totalImages > 5) {
      setProduct((prevState) => ({
        ...prevState,
        error: "You can only upload up to 5 images.",
      }));
      toast.error("You can only upload up to 5 images.");
      return;
    }

    setProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
      error: "",
    }));
  };

  const removeImage = (index) => {
    setProduct((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "images" && key !== "error") formData.append(key, product[key]);
    });
    product.images.forEach((image) => formData.append("images", image));

    try {
      let token = Cookies.get("token");
      formData.append("token", token);
      await axios.put(`https://ecomm-8piu.onrender.com/ecomm/admin/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setProduct({
        name: "",
        description: "",
        price: "",
        discount: "",
        quantity: "",
        category: "",
        subcategory: "",
        images: [],
        error: "",
      });
      setLoading(false);
      toast.success("Product updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Failed to update product");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ padding: "20px", borderRadius: "10px" }}>
      <ToastContainer position="top-right" />
      <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px" }}>EDIT YOUR PRODUCT</h2>
      <form onSubmit={handleSubmit} className="container mt-4">
        <label className="form-label" style={{ color: "#000000" }}>Category</label>
        <select className="form-select" name="category" value={product.category} onChange={handleCategoryChange} required style={{ borderColor: "#000000", color: "#000000" }}>
          <option value="">Select Category</option>
          {Object.keys(categoryOptions).map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        {product.category && (
          <div>
            <label className="form-label" style={{ color: "#000000" }}>Subcategory</label>
            <select className="form-select" name="subcategory" value={product.subcategory} onChange={handleChange} required style={{ borderColor: "#000000", color: "#000000" }}>
              <option value="">Select Subcategory</option>
              {categoryOptions[product.category]?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        <label className="form-label" style={{ color: "#000000" }}>Product Name</label>
        <input type="text" className="form-control" name="name" value={product.name} onChange={handleChange} required style={{ borderColor: "#000000" }} />

        <label className="form-label" style={{ color: "#000000" }}>Description</label>
        <textarea className="form-control" name="description" value={product.description} onChange={handleChange} required style={{ borderColor: "#000000" }} />

        <label className="form-label" style={{ color: "#000000" }}>Price</label>
        <input type="number" className="form-control" name="price" value={product.price} onChange={handleChange} required style={{ borderColor: "#000000" }} />

        <label className="form-label" style={{ color: "#000000" }}>Discount (%)</label>
        <input type="number" className="form-control" name="discount" value={product.discount} onChange={handleChange} required style={{ borderColor: "#000000" }} />

        <label className="form-label" style={{ color: "#000000" }}>Quantity</label>
        <input type="number" className="form-control" name="quantity" value={product.quantity} onChange={handleChange} required style={{ borderColor: "#000000" }} />

        <label className="form-label" style={{ color: "#000000" }}>Product Images</label>
        <input type="file" className="form-control" multiple accept="image/*" onChange={handleImageChange} style={{ borderColor: "#000000" }} />
        {product.error && <p style={{ color: "red", fontSize: "14px" }}>{product.error}</p>}

        <div className="mt-2">
          {product.images.length > 0 && product.images.map((image, index) => (
            <div key={index} className="position-relative d-inline-block">
              <img src={typeof image === "string" ? image : URL.createObjectURL(image)} alt="Product" className="img-thumbnail me-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              <IconButton onClick={() => removeImage(index)} size="small" style={{ position: "absolute", top: "-5px", right: "-5px", backgroundColor: "rgba(0,0,0,0.7)", color: "#FFD700" }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>

        <Button type="submit" variant="contained" style={{ backgroundColor: "#28a745", color: "#fff", width: "100%", marginTop: "20px" }}>
          Update Product
        </Button>
      </form>

      {/* Clean Backdrop loading spinner */}
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
