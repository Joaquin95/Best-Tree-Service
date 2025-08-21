import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import "../index.css";
import { useNavigate } from "react-router-dom";
import InlineEstimateForm from "../components/InlineEstimateForm";

export default function Home() {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const handleGAEvent = (eventName, label) => {
    if (window.gtag) {
      window.gtag("event", eventName, {
        event_category: "engagement",
        event_label: label,
        value: 1,
      });
    }
  };

  return (
    <main>
      <Helmet>
        <title>Best Tree Service DFW | Tree Trimming & Removal</title>
        <meta
          name="description"
          content="Professional tree services in Dallas-Fort Worth. Free estimates. Emergency tree removal, trimming, and more."
        />
        <meta
          name="keywords"
          content="tree service DFW, tree trimming Dallas, emergency tree removal, arborist, stump grinding"
        />
        <meta name="author" content="J.M. for Best Tree Service DFW" />
      </Helmet>

      <Navbar />
      {/* The Navbar component is imported and used here */
      /* It contains links to the experience and contact sections */}
      <section className="hero-section">
        <h1 className="heading">
          Best Tree Service DFW <br />
          Residential & Commercial Tree Care Experts
        </h1>
        <p className="subheading">
          <strong>
            Serving Dallas–Fort Worth and all surrounding areas with
            professional tree trimming, removal, and emergency services. Trusted
            by homeowners and businesses since 2021
            <p>
              📞 <strong>Phone:</strong>{" "}
              <a
                href="tel:2149447415"
                onClick={() =>
                  handleGAEvent("phone_click", "Phone Number Click")
                }
              >
                (214)944-7415
              </a>
            </p>
            <p>
              📧 <strong>Email:</strong>{" "}
              <a
                href="mailto:Besttreeservicedfw@gmail.com"
                onClick={() => handleGAEvent("email_click", "Email Click")}
              >
                Besttreeservicedfw@gmail.com
              </a>
            </p>
          </strong>
        </p>
        <InlineEstimateForm onSuccess={() => navigate("/thank-you")} />
        <br />
        {/* <section className="trust-section"> */}
        <h2>Trusted Tree Experts in DFW Since 2021</h2>
        <p>
          <strong>
            We are a team of experienced Professionals offering top-notch tree
            services. Whether you need tree trimming, removal, or emergency
            services, we have you covered. Our team is dedicated to providing
            the best service possible, ensuring your trees are healthy and your
            property is safe.
          </strong>
        </p>

        <strong>
          <ul className="trust-list">
            <li>✅ Fully Licensed & Insured</li>
            <li>✅ Emergency Tree Removal Available 24/7</li>
            <li>
              ✅ Payment Options: Zelle, Cash, Check, Visa, Mastercard, Amex
            </li>
            <li>✅ Free Estimates & Transparent Pricing</li>
          </ul>
        </strong>
      </section>

      {/* Contact us Section */}
      <section id="contact" className="contact-section">
        <h2>Client Testimonials</h2>
        <blockquote>
          <h3>
            “Carlos and his team showed up on time, walked me through the entire
            process, and had the tree removed within hours. They even cleaned up
            the yard better than it was before. I’ve worked with other tree
            services in the past, but this was by far the most professional
            experience I’ve had.” — Sarah, Plano, Tx
          </h3>
        </blockquote>
        <blockquote>
          <h3>
            “We had a massive oak leaning dangerously close to our house after a
            storm. I called Best Tree Service DFW and they were out within the
            hour. The crew was calm, confident, and clearly experienced. They
            removed the tree safely I’ve already recommended them to my
            neighbors.” — Issac, Mansfield, Tx
          </h3>
        </blockquote>
        <blockquote>
          <h3>
            “I manage several commercial properties in Richardson, and Best Tree
            Service DFW is now our go-to tree service. They’re responsive,
            insured, and always leave the site spotless. Whether it’s trimming,
            removal, or emergency work — they deliver every time.” — Monica
            Property Manager, Richardson, TX{" "}
          </h3>
        </blockquote>
        <h2>Contact us</h2>
        <p> For inquiries or to schedule a service, please contact us at:</p>
        <p>
          Phone:{" "}
          <a
            href="tel:2149447415"
            onClick={() => handleGAEvent("phone_click", "Phone Number Click")}
          >
            (214)944-7415{" "}
          </a>{" "}
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:Besttreeservicedfw@gmail.com"
            onClick={() => handleGAEvent("email_click", "Email Click")}
          >
            Besttreeservicedfw@gmail.com{" "}
          </a>
        </p>
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

        <p>Location: Dallas, TX</p>
      </section>
      <Footer />
    </main>
  );
}
