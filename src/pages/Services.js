import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EstimateForm from "./EstimateForm";
const services = [
  "Emergency Tree Removal",
  "Emergency Storm Damage",
  "Tree Cutting",
  "Tree Stump Removal / Grinding",
  "Tree Stump Removal",
  "Tree and Limb Removal",
  "Tree Pruning",
  "Tree Trimming and Thinning",
  "Tree and Brush Clearing",
];

export default function Services() {
  return (
    <main>
      <Navbar />
      <section className="services-hero">
        <h1>Tree Services in Dallas-Fort Worth and All Surrounding Areas</h1>
        <p>
          <strong>
            We specialize in tree trimming, removal, stump grinding, and
            emergency response. Whether you're a homeowner or a commercial
            property manager, our team ensures your trees are healthy and your
            property is safe serving Dallas, Mesquite, Garland, and all surrounding
            areas, we’re proud to be your go-to team for safe, professional tree
            care.
          </strong>
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
        <p><strong>
          We offer free estimates and fast scheduling. Let us know what you need
          and we’ll take care of the rest.</strong>
        </p>
        <EstimateForm />
      </section>

      <Footer />
    </main>
  );
}
