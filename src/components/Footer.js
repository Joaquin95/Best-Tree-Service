import React from "react";
import "../index.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Best Tree Service. All rights
          reserved.
        </p>

      </div>
    </footer>
  );
}
