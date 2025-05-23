import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function EstimateForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [status, setStatus] = useState(""); // State to manage form submission status
  const navigate = useNavigate(); // useNavigate is a hook that returns a function that lets you navigate
  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true shows loading spinner

    try {
      // Google Analytics event tracking}
      const response = await fetch("https://formspree.io/f/mgvkbynr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false); // Set loading state to false hides loading spinner

      if (response.ok) {
        setStatus("Success");

        if (window.gtag) {
          window.gtag("event", "form_submit", {
            form: "estimate_form",
            status: "success",
          });
        }

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });

        navigate("/thank-you");
      } else {
        setStatus("ERROR");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setIsLoading(false);
      setStatus("ERROR");
    }
  };

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <section className="form-container">
          <h2>Get a Free Estimate</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={3000}
                placeholder="Please provide details about your tree service needs."
                required
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {status === "SUCCESS" && (
            <p className="success">
              We will contact you shortly to discuss your needs.
            </p>
          )}
          {status === "ERROR" && (
            <p className="error">
              Oops! Something went wrong. Please try again.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
// This component serves as the estimate form for the application
