import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function StumpGrinding() {
  return (
    <main>
      <Navbar />
      <section className="service-hero">
        <h1>Stump Grinding Services in Dallas-Fort Worth</h1>
        <p>
          Leftover stumps can be hazardous, unsightly, and attract pests. We grind them down quickly and cleanly, leaving your yard safe and smooth.
        </p>
      </section>

      <section className="service-details">
        <h2>Why Choose Us for Stump Grinding?</h2>
        <ul>
          <li>✅ Fast, efficient stump removal</li>
          <li>✅ No damage to surrounding landscape</li>
          <li>✅ Haul-away and cleanup included</li>
          <li>✅ Affordable pricing with free estimates</li>
        </ul>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <h3>How deep do you grind the stump?</h3>
        <p>We typically grind 6–12 inches below ground level, depending on your needs.</p>

        <h3>Can you remove the roots too?</h3>
        <p>We grind the stump and surface roots. Full root removal is available upon request.</p>

        <h3>Will the area be ready for replanting?</h3>
        <p>Yes — we can backfill the area and prep it for sod, seed, or planting.</p>
      </section>
      <Footer />
    </main>
  );
}