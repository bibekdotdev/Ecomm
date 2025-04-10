import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); // loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let jwtToken = await axios.post('https://ecomm-8piu.onrender.com/ecomm/authentication/tempup', formData);
            let e = jwtToken.data.email;
            setFormData({ username: "", email: "", password: "" });
            
            setTimeout(() => {
                toast.success("Otp send");
            }, 500);
                navigate('/otppage', { state: { e } });
        } catch (error) {
            const errMsg = error.response?.data?.error || "Signup failed.";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <form onSubmit={handleSubmit} className="container mt-4 p-4 rounded shadow" style={{ color: "#000000" }}>
                <h2 className="text-center mb-4" style={{ color: "#000000", fontWeight: "bold" }}>Signup</h2>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label" style={{ color: "#000000" }}>Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="Enter your username"
                        required 
                        style={{ backgroundColor: "#FFFFFF", color: "#000000", border: "1px solid #000000" }} 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{ color: "#000000" }}>Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email"
                        required 
                        style={{ backgroundColor: "#FFFFFF", color: "#000000", border: "1px solid #000000" }} 
                    />
                    <div id="emailHelp" className="form-text" style={{ color: "#757575" }}>We'll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{ color: "#000000" }}>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Enter your password"
                        required 
                        style={{ backgroundColor: "#FFFFFF", color: "#000000", border: "1px solid #000000" }} 
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn w-100" 
                    style={{ 
                        backgroundColor: "#28a745", 
                        color: "#FFFFFF", 
                        fontWeight: "bold", 
                        border: "none", 
                        padding: "10px 15px" 
                    }}
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </>
    );
};

export default Signup;
