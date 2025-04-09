import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPPage = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    let location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/ecomm/authentication/signup', {
                otp,
                id: location.state.e
            });

            const jwtToken = response.data.token;

            if (jwtToken) {
                console.log("JWT Token received:", jwtToken);
                Cookies.set("token", jwtToken, { expires: 7, secure: true, sameSite: 'Lax' });
                toast.success("OTP Verified Successfully!");
                // setTimeout(() => {
                    navigate('/Home');
                // }, 500);
            } else {
                toast.error("No token received. Something went wrong.");
            }
        } catch (error) {
            console.error("OTP verification failed:", error.response?.data || error.message);
            toast.error("Invalid OTP or server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <form onSubmit={handleSubmit} className="container mt-4 p-4 rounded shadow">
                <h2 style={{ color: "#000000" }}>Enter OTP</h2>
                <div className="mb-3">
                    <label htmlFor="otp" className="form-label" style={{ color: "#000000" }}>OTP</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="otp" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required
                        style={{ backgroundColor: "#F0F0F0", color: "#000000", border: "1px solid #000000" }}
                    />
                </div>
                <button
                    type="submit"
                    className="btn w-100"
                    style={{ backgroundColor: "#28a745", color: "#EAEAEA" }}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        "Verify OTP"
                    )}
                </button>
            </form>
        </>
    );
};

export default OTPPage;
