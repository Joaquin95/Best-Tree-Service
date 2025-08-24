import React from "react";
import "../index.css"; 

export default function ContactBar({ handleGAEvent }) {
  return (
    <div className="navbar-top-bar">
      <div className="top-info">
        <span className="contact">
          <strong>
            <p>
              📞 <strong>Phone:</strong>{" "}
              <a
                href="tel:2149447415"
                onClick={() => handleGAEvent("phone_click", "Phone Number Click")}
              >
                (214) 944-7415
              </a>
            </p><br /> <br/>
            <p> 
              📧 <strong>Email:</strong>{" "}
              <a
                href="mailto:Besttreeservicedfw@gmail.com"
                onClick={() => handleGAEvent("email_click", "Email Click")}
              >
                Besttreeservicedfw@gmail.com
              </a>
            </p> <br/> <br/>
                 <p>
          <a
            href="https://www.facebook.com/profile.php?id=61560664231263"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (window.gtag) {
                window.gtag("event", "click", {
                  event_category: "social",
                  event_label: "Facebook Profile Link",
                  value: 1,
                });
              }
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <img
              src="/icons/facebook.svg"
              alt="Facebook"
              width="20"
              height="20"
              style={{ verticalAlign: "middle" }}
            />
            Visit us on Facebook
          </a>
        </p>
          {" "}<br />
          <h3>
           24/7 Service | Dallas / Ft. Worth Metroplex
       Accepts: Cash, Check, Credit cards, Venmo, Zelle</h3>
</strong>
 </span> 
      </div>

      {/* <div className="social-icons">
        <a href="https://instagram.com/" aria-label="Instagram">
          <i className="fab fa-instagram" /> Instagram
        </a>
        <a href="https://facebook.com/" aria-label="Facebook">
          <i className="fab fa-facebook-f" /> Facebook
        </a>
      </div> */}
    </div>
  );
}