import React from "react";
import "../index.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="#about-us">About Us</a>
        </li>
        <li>
          <a href="#contact">Contact Us</a>
        </li>
      </ul>
    </nav>
  );
}
