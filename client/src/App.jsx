import React from "react";
import Navbar from "./assets/pages/navbar";
import { Link, Outlet } from "react-router-dom";
import Footer from "./assets/pages/footer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, mt: "40px" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};
  

export default App;
