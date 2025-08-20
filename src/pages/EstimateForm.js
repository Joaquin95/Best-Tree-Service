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

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter 10-digit phone";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
        setIsLoading(true);

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

        setIsLoading(false);

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

         setTimeout(() =>  navigate("/thank-you"), 2000);
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
                {errors.name && <span className="error">{errors.name}</span>}

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
                 {errors.email && <span className="error">{errors.email}</span>}

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
                {errors.phone && <span className="error">{errors.phone}</span>}
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
  };
