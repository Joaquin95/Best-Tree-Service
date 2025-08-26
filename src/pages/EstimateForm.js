import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

export default function EstimateForm({ onSuccess }) {
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

    const siteKey = process.env.REACT_APP_RECAPTCHA_SITEKEY;
  console.log("🔑 siteKey from estimate form :", siteKey);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errs = {};
    const digits = formData.phone.replace(/\D/g, "");

    if (!formData.name.trim()) errs.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (digits.length !== 10) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.address.trim() || formData.address.length < 5)
      errs.address = "Enter a valid address";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (analytics) {
        logEvent(analytics, "form_submit", {
          event_category: "lead_generation",
          event_label: "EstimateForm",
        });
      }
    } catch (err) {
      console.warn("Analytics not initialized:", err);
    }

    if (!recaptchaRef.current) {
      console.error("reCAPTCHA not initialized");
      setStatus("ERROR");
      setIsLoading(false);
      return;
    }
  recaptchaRef.current.execute();
  };

    const onRecaptchaChange = async (token) => {
    console.log("💡 reCAPTCHA token:", token);
    recaptchaRef.current.reset();


    try {
      const response = await fetch(
        "https://us-central1-best-tree-service-a1029.cloudfunctions.net/onFormSubmit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, token }),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        console.log("Function result:", result);
        setStatus("SUCCESS");

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          message: "",
        });

        const goThankYou = () => {
          onSuccess?.();
          navigate("/thank-you");
        };

        if (window.gtag) {
          window.gtag("event", "form_submit", {
            event_category: "lead_generation",
            event_label: `EstimateForm – ${window.location.pathname}`,
            value: 1,
            event_callback: goThankYou,
          });
          setTimeout(goThankYou, 3000);
        } else {
          goThankYou();
        }
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("ERROR");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="page-wrapper">
      <main className="main-content">
        <section className="form-container">
          <h2>Get a Free Estimate</h2>
          <form onSubmit={handleSubmit} noValidate>
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
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </label>
            <label>
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={3000}
                placeholder="Please provide details about your tree service needs."
              />
            </label>
            <ReCAPTCHA sitekey={siteKey} size="invisible" ref={recaptchaRef} />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting…" : "Get Estimate"}
            </button>
          </form>

          {status === "SUCCESS" && (
            <p className="success">
              We will contact you shortly to discuss your needs.
            </p>
          )}
          {status === "ERROR" && (
            <p className="error">
              Oops! Something went wrong from estimate form . Please try again.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
