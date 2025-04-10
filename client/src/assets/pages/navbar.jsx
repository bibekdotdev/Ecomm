import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const [refresh, setRefresh] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && !event.target.closest(".sidebar") && !event.target.closest(".btn")) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSidebar]);

  async function Logout() {
    Cookies.remove("token");
    setRefresh(!refresh);
    setShowSidebar(false); // Close sidebar on logout
  }

  const isLogin = !!Cookies.get("token");

  const handleNavClick = () => {
    setShowSidebar(false); // Close sidebar on any navigation
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm fixed-top" style={{ backgroundColor: "#007bff" }}>
        <div className="container-fluid">
          {/* Sidebar Toggle Button */}
          <button className="btn text-white me-3 d-lg-none" onClick={() => setShowSidebar(!showSidebar)}>
            ☰
          </button>
      
          <Link className="navbar-brand fw-bold text-white" to="/"> ShopVerse</Link>
          {/* <i class="fa-solid fa-feather"></i>  */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/" onClick={handleNavClick}>🏠 Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/addtocart" onClick={handleNavClick}>🛒 Cart</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/myorder" onClick={handleNavClick}>📦 MyOrder</Link>
              </li>
               <li className="nav-item">
                    <Link className="nav-link text-white" to="/admin" onClick={handleNavClick}>⚙️ Admin</Link>
                  </li>
              {!isLogin ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/login" onClick={handleNavClick}>🔑 Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/signup" onClick={handleNavClick}>📝 Signup</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button className="nav-link btn btn-outline-light text-white" onClick={Logout}>🚪 Logout</button>
                  </li>
                 
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar Navbar */}
      <div className={`sidebar p-3 ${showSidebar ? "show-sidebar" : ""}`} style={{ backgroundColor: "#007bff" }}>
        <button className="btn btn-close btn-light mb-3" onClick={() => setShowSidebar(false)}></button>
        <h5 className="text-center text-white">📋 Menu</h5>
        <hr />
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/" onClick={handleNavClick}>🏠 Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/addtocart" onClick={handleNavClick}>🛒 Cart</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/myorder" onClick={handleNavClick}>📦 MyOrder</Link>
          </li>
           <li className="nav-item">
                <Link className="nav-link text-white" to="/admin" onClick={handleNavClick}>⚙️ Admin</Link>
              </li>
          {!isLogin ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login" onClick={handleNavClick}>🔑 Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signup" onClick={handleNavClick}>📝 Signup</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <button className="nav-link btn btn-outline-light text-white" onClick={Logout}>🚪 Logout</button>
              </li>
          
            </>
          )}
        </ul>
      </div>

      {/* CSS Styles */}
      <style>
        {`
          .sidebar {
            position: fixed;
            top: 0;
            left: -280px;
            width: 250px;
            height: 100%;
            transition: 0.3s;
            padding-top: 20px;
            z-index: 1050;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
          }
          .show-sidebar {
            left: 0;
          }

          .nav-link {
            color: white !important;
            font-weight: bold;
            transition: 0.3s;
          }

          .nav-link:hover {
            color: #f8f9fa !important; /* Light gray on hover */
            background-color: #0056b3; /* Darker blue background on hover */
          }

          .btn-close {
            position: absolute;
            top: 10px;
            right: 10px;
          }

          .search-bar-container {
            top: 56px;
            position: fixed;
            width: 100%;
            z-index: 1025;
          }

          .search-bar {
            width: 100%;
            z-index: 1030;
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
