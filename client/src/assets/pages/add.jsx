import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import BackdropLoader from "./BackdropLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    category: "",
    subcategory: "",
    images: [],
  });

  const categoryOptions = {
    electronics: ["Laptop", "Smartphone", "Headphones", "Tablet", "Camera"],
    fashion: ["Shirt", "Jeans", "Jacket", "Dress", "Kurta"],
    home: ["Sofa", "Chair", "Table", "Bed", "Curtain"],
    beauty: ["Makeup Kit", "Perfume", "Hair Dryer", "Shampoo"],
    kids: ["Toys", "Books", "Diapers", "Baby Food", "Shirt"],
    accessories: ["Sunglasses", "Watch", "Bags", "Wallet", "Shoes"],
  };

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
      setError("You can only upload up to 5 images.");
      toast.error("You can only upload up to 5 images.");
      return;
    }

    setProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
    setError("");
  };

  const removeImage = (index) => {
    setProduct((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    handleOpen();

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "images") formData.append(key, product[key]);
    });
    product.images.forEach((image) => formData.append("images", image));

    try {
      const token = Cookies.get("token");
      formData.append("token", token);

      await axios.post("https://ecomm-8piu.onrender.com/ecomm/product/add", formData, {
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
      });

      handleClose();
      setTimeout(() => {
        toast.success("Product added successfully!");
      }, 500);
      navigate("/home");
    } catch (error) {
      handleClose();
      console.error("Error submitting product:", error);
      setError("Failed to add product. Please try again.");
      toast.error("Failed to add product. Please try again.");
      
    }
  };

  return (
    <div className="container mt-4" style={{ padding: "20px", borderRadius: "10px" }}>
      <h2 style={{ color: "#000000", textAlign: "center", marginBottom: "20px" }}>ADD YOUR PRODUCT</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="form-label" style={{ color: "#000000" }}>Category</label>
        <select className="form-select" name="category" value={product.category} onChange={handleCategoryChange} required style={{ borderColor: "#000000" }}>
          <option value="">Select Category</option>
          {Object.keys(categoryOptions).map((cat) => (
            <option key={cat} value={cat} style={{ color: "#000000" }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        {product.category && (
          <>
            <label className="form-label" style={{ color: "#000000" }}>Subcategory</label>
            <select className="form-select" name="subcategory" value={product.subcategory} onChange={handleChange} required style={{ borderColor: "#000000" }}>
              <option value="">Select Subcategory</option>
              {categoryOptions[product.category]?.map((option, index) => (
                <option key={index} value={option} style={{ color: "#000000" }}>{option}</option>
              ))}
            </select>
          </>
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
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

        <div className="mt-2">
          {product.images.length > 0 && product.images.map((image, index) => (
            <div key={index} className="position-relative d-inline-block">
              <img src={typeof image === "string" ? image : URL.createObjectURL(image)} alt="Product" className="img-thumbnail me-2" style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #000000" }} />
              <IconButton onClick={() => removeImage(index)} size="small" style={{ position: "absolute", top: "-5px", right: "-5px", backgroundColor: "#ff6347", color: "white" }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>

        <Button type="submit" variant="contained" style={{ backgroundColor: "#28a745", color: "white", width: "100%", marginTop: "10px" }}>
          Add Product
        </Button>
      </form>

      <BackdropLoader open={open} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProductForm;
