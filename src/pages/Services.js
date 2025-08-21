import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const services = [
  "Emergency Tree Removal",
  "Tree Cutting",
  "Tree Work",
  "Tree Stump Grinding",
  "Tree Stump Removal",
  "Emergency Storm Damage",
  "Tree Care",
  "Tree Removal",
  "Limb Removal",
  "Tree Pruning",
  "Tree Trimming",
  "Tree Thinning",
  "Lot Clearing",
  "Tree Clearing",
  "Brush Clearing",
  "Land Clearing",
  "Tree Fertilizing",
];

export default function Services() {
  return (
    <main>
      <Navbar />
      <section className="services-hero">
        <h1>Tree Services in Dallas-Fort Worth and All Surrounding Areas</h1>
        <p>
          We offer a full range of professional tree care services to keep your
          property safe, beautiful, and thriving. Whether you need emergency
          removal or seasonal trimming, our certified arborists are here to
          help.
        </p>
      </section>

      <section className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h2>{service}</h2>
            <p>
              {service.includes("Removal") || service.includes("Clearing")
                ? "Safe, efficient removal with full cleanup included."
                : service.includes("Trimming") || service.includes("Pruning")
                ? "Promotes healthy growth and improves appearance."
                : service.includes("Fertilizing")
                ? "Deep root feeding and nutrient balancing for tree health."
                : "Expert care tailored to your tree’s needs."}
            </p>
          </div>
        ))}
      </section>
      <section className="cta-section">
        <h2>Get your free estimate </h2>
        <p>
          We offer free estimates and fast scheduling. Let us know what you need
          and we’ll take care of the rest.
        </p>
        <button
          className="cta-button"
          onClick={() => (window.location.href = "/#estimate-form")}
        >
          Get a Free Estimate
        </button>
      </section>

      <Footer />
    </main>
  );
}
