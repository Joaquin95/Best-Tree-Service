import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";

export default function Home() {
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
      <Navbar />
      {/* The Navbar component is imported and used here */
      /* It contains links to the experience and contact sections */}
      <section className="hero-section">
        <img src="/images/Best_Tree_Service.jpg" alt="logo" className="hero-img" />
        <h1 className="heading">Best Tree Service DFW</h1>
        <p className="subheading">
          <strong>Professional Tree Trimming & Removal. Serving all of Dallas and
          surrounding areas.</strong>
        </p>
        <button
          className="cta-button"
          onClick={() => {
            handleGAEvent("estimate_button_click", "Estimate Button Click");
            window.open("/estimate", "_blank");
          }}
        >
          Get a Free Estimate
        </button>
        <p>
          Phone:{" "}
          <a
            href="tel:2149447415"
            onClick={() => handleGAEvent("phone_click", "Phone Number Click")}
          >
            (214)944-7415
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:Besttreeservicedfw@gmail.com"
            onClick={() => handleGAEvent("email_click", "Email Click")}
          >
           Besttreeservicedfw@gmail.com
          </a>
        </p>
      </section>

      <section className="services-section">
        <h2>Experience</h2>
        <Slider {...sliderSettings}>
          <div>
            <img
              src="/images/Emergency-tree-work.jpg"
              alt="Emergency Tree Work"
              className="slider-image"
            />
          </div>

          <div>
            <img
              src="/images/residential-tree-services.jpg"
              alt="Residential Tree Services"
              className="slider-image"
            />
          </div>

          <div>
            <img
              src="/images/tree-cutting.jpg"
              alt="Tree Cutting"
              className="slider-image"
            />
          </div>

          <div>
            <img
              src="/images/Tree-trimming-from-ground.jpg"
              alt="Tree Trimming from Ground"
              className="slider-image"
            />
          </div>
        </Slider>
      </section>
      {/* The slider section contains images of the services offered */
      /* The slider settings include autoplay, speed, and number of slides to show */
      /* Each slide contains an image representing a service offered */}

      {/* The hero section contains a heading, subheading, and a call-to-action button */
      /* The button opens a new tab to the estimate page when clicked */}

      {/* About us Section vvv*/}
      <section id="about-us" className="about-section">
        <h2>About Us</h2>
        <p>
          <strong>We are a team of experienced Professionals offering top-notch tree
          services. Whether you need tree trimming, removal, or emergency
          services, we have you covered. Our team is dedicated to providing the
          best service possible, ensuring your trees are healthy and your
          property is safe.</strong> 
        </p>
      </section>

      {/* Contact us Section vv*/}
      <section id="contact" className="contact-section">
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
        <p>Location: Dallas, TX</p>
      </section>
      <Footer />
      {/* The Footer component is imported and used here */}
      {/* It contains the copyright information and contact details */}
    </main>
  );
}
// This component serves as the home page of the application
// It includes a title, description, and a button for getting a free estimate
