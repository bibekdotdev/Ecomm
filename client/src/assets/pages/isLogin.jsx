import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const response = await axios.post(`http://localhost:8080/ecomm/admin/islogin/${token}`);
        setIsAuth(response.data); // assuming response.data is true/false
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <p>Loading...</p>; // Better: use spinner
  }

  console.log('isPath', location.pathname);
  localStorage.setItem("redirectTo", location.pathname);

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
