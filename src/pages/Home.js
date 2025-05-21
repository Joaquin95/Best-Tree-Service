import React from "react";
import "../index.css";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <h1 className="heading">Best Tree Service</h1>
        <p className="subheading">Professional Tree Trimming & Removal in Your Area</p>
        <button className="cta-button" onClick={() => window.open("/estimate", "_blank")}>
          Get a Free Estimate
        </button>
      </section>

      {/* The hero section contains a heading, subheading, and a call-to-action button */
      /* The button opens a new tab to the estimate page when clicked */}

      {/* About us Section vvv*/}
      <section className="about-section">
        <h2>About us</h2>
        <p> We are a team of experienced Professionals offering top-notch tree services.
          Whether you need tree trimming, removal, or emergency services, we have you covered.
          Our team is dedicated to providing the best service possible, ensuring your trees are healthy and your property is safe.
        </p>
      </section>

      {/* Contact us Section vv*/}
        <section className="contact-section">
          <h2>Contact us</h2>
          <p> For inquiries or to schedule a service, please contact us at:</p>
          <p>Phone: <a href="tel:2145181437">(214)518-1437  </a> </p>
          <p>Email: <a href="mailto:Mintinvestments95@gmail.com">Mintinvestments95@gmail.com </a> </p>
          <p>Location: Dallas, TX</p>
        </section>
    </main>
  );
}
// This component serves as the home page of the application
// It includes a title, description, and a button for getting a free estimate
