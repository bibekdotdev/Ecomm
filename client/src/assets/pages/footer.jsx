import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-4 mt-5 border-top" style={{ backgroundColor: "#0d6efd" }}>
      <div className="container text-center text-white">
        <h5 className="mb-3">Developed by <span className="fw-bold">Bibek Jana</span></h5>
        <div className="d-flex justify-content-center gap-4 mb-3 fs-4">
          <a href="#" className="text-white" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/bibek-jana-39aa902b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " className="text-white" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="#" className="text-white" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
         <a href="mailto:bibekjana68@gmail.com" className="text-white">
            <FaEnvelope />
          </a>
        </div>
        <small className="text-white-50">&copy; {new Date().getFullYear()} Bibek Jana. All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;
