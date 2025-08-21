import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../index.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <img
        src="/images/Best_Tree_Service.jpg"
        alt="logo"
        className="nav-img"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      />
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </button>
      <ul className={`nav-list ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/services">Services</Link>
        </li>

        <li>
          <a href="#service-area">Service Area</a>
        </li>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
        {/* <li>
          <a href="#about-us">About Us</a>
        </li> */}
        <li>
          <a href="#contact">Contact Us</a>
        </li>
      </ul>
    </nav>
  );
}
