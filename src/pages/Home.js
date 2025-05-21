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

    </main>
  );
}
// This component serves as the home page of the application
// It includes a title, description, and a button for getting a free estimate
