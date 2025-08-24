import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContactBar from "./ContactBar"; 
import "../index.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleGAEvent = (action, label) => {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: "Navbar",
        event_label: label,
      });
    } else {
      console.log(`GA Event: ${action} - ${label}`);
    }
  };

  return (
    <header className="navbar-header">
      
      <nav className="navbar-main">
        <div className="navbar-inner">
          <img
            src="/images/tree.png"
            alt="Best Tree Service Logo"
            className="nav-logo"
            onClick={() => navigate("/")}
          />
          <div className="nav-heading">
            <h1 className="heading">
              Best Tree Service DFW <br />
              Residential & Commercial Tree Care Experts
            </h1>
            <span className="slogan">
              Your Local Experts in Safe, Reliable Tree Service.
            </span>
          </div>
         
          <button
            className="hamburger"
            aria-label="Toggle menu"
            onClick={handleToggle}
          >
            {isOpen ? "✖" : "☰"}
          </button>

          <ul className={`nav-list ${isOpen ? "open" : ""}`}>
            <li>
              <Link to="/services" onClick={() => setIsOpen(false)}>
                Services
              </Link>
            </li>
            <li>
              <a href="#service-area" onClick={() => setIsOpen(false)}>
                Service Area
              </a>
            </li>
            <li>
              <Link to="/gallery" onClick={() => setIsOpen(false)}>
                Gallery
              </Link>
            </li>
            <li>
              <a href="#contact" onClick={() => setIsOpen(false)}>
                Contact Us
              </a>
            </li>
          </ul>
        </div>
         <ContactBar handleGAEvent={handleGAEvent} />

      </nav>
    </header>
  );
}
