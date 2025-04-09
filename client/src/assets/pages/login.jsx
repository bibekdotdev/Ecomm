import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState(""); // Ensure default value is empty
  const [password, setPassword] = useState(""); // Ensure default value is empty
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      let jwtToken = await axios.post("http://localhost:8080/ecomm/authentication/login", { email, password });
      let val = jwtToken.data;
      const redirectTo = "/home";
      console.log(redirectTo);
      localStorage.removeItem("redirectTo"); // Clear it after use
      setEmail(""); // Clear fields after submission
      setPassword("");
      Cookies.set("token", val, { expires: 7, secure: true });
      setTimeout(()=>{
        toast.success("Login successful!");
      },500)
      navigate(redirectTo);
    
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response.data);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <form onSubmit={handleSubmit} className="container mt-4 p-4 rounded shadow" style={{ color: "#000000" }}>
        <h2 className="text-center mb-4" style={{ color: "#000000" }}>Login</h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{ color: "#000000" }}>Email address</label>
          <input
            type="email"
            className="form-control w-100"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="emailHelp"
            autoComplete="off"
            placeholder="Enter Email"
            required
            style={{ backgroundColor: "#FFFFFF", color: "#000000", border: "1px solid #000000" }}
          />
          <div id="emailHelp" className="form-text" style={{ color: "#000000" }}>We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{ color: "#000000" }}>Password</label>
          <input
            type="password"
            className="form-control w-100"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter Password"
            required
            style={{ backgroundColor: "#FFFFFF", color: "#000000", border: "1px solid #000000" }}
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "#28a745", color: "#FFFFFF", fontWeight: "bold" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default Login;
