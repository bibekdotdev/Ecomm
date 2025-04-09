import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("No token found");
                const response = await axios.post("http://localhost:8080/ecomm/admin/yourproduct", { token },);
                setProducts(response.data);
            } catch (error) {
                toast.error("Error fetching products");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No token found");
            await axios.delete(`http://localhost:8080/ecomm/admin/deleteproduct/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter(product => product._id !== id));
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete product");
            console.error("Error deleting product:", error);
        }
    };

    const fetchOrders = () => {
        navigate('/vieworder');
    };

    return (
        <div className="container mt-4" style={{ color: "#333333" }}>
            <ToastContainer autoClose={3000} pauseOnHover />
            <h2 className="text-center py-3 rounded shadow" style={{ backgroundColor: "#1f3a5e", color: "#ffffff" }}>Admin Dashboard</h2>
            <p className="text-center" style={{ color: "#333333" }}>Manage your products and view customer orders.</p>
            
            <div className="d-flex justify-content-center mb-4 gap-3">
                <Link className="btn text-white fw-bold shadow px-5 py-3" to="/add" style={{ backgroundColor: "#c54c82", borderRadius: "12px", fontSize: "1.2rem" }}>➕ Add Product</Link>
                <button className="btn fw-bold shadow px-5 py-3" onClick={fetchOrders} style={{ borderRadius: "12px", fontSize: "1.2rem", backgroundColor: "#f1c232" }}>📦 View Orders</button>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center text-muted">No products available</div>
                    ) : (
                        products.map((product, index) => (
                            <div key={index} className="mb-4 p-4 rounded shadow" style={{ backgroundColor: "#f9f9f9" }}>
                                <div className="row align-items-center g-4">
                                    <div className="col-lg-6 text-center">
                                        <div id={`productCarousel${index}`} className="carousel slide" data-bs-ride="carousel">
                                            <div className="carousel-inner">
                                                {product?.images?.map((img, imgIndex) => (
                                                    <div key={imgIndex} className={`carousel-item ${imgIndex === 0 ? "active" : ""}`}>
                                                        <img src={img} className="d-block w-100 img-fluid rounded shadow-sm border" style={{ height: "350px", objectFit: "cover" }} alt={`Product Image ${imgIndex}`} />
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="carousel-control-prev" type="button" data-bs-target={`#productCarousel${index}`} data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: "#000000" }}></span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target={`#productCarousel${index}`} data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: "#000000" }}></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <h3 className="fw-bold" style={{ color: "#333333" }}>{product?.name}</h3>
                                        <p className="text-dark">{product?.description}</p>
                                        <p><strong style={{ color: "#333333" }}>Category:</strong> <span className="text-black">{product?.category}</span></p>
                                        <p><strong style={{ color: "#333333" }}>Quantity:</strong> <span className="text-black">{product?.quantity}</span></p>
                                        <div className="mt-3">
                                            <Link className="btn btn-outline-dark me-2 fw-bold" to={`/edit/${product?._id}`} style={{ borderColor: "#333333" }}>✏ Edit</Link>
                                            <button className="btn btn-outline-danger fw-bold" onClick={() => handleDelete(product?._id)} style={{ borderColor: "#333333" }}>🗑 Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
}
