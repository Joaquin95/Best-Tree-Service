import React from "react";
import "../index.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          <strong>
            &copy; {new Date().getFullYear()} Best Tree Service DFW . All rights
            reserved.
          </strong>
        </p>
      </div>
    </footer>
  );
}
