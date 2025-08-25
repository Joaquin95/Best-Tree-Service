import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { functions } from "../firebase";
import ReCAPTCHA from "react-google-recaptcha";
import { httpsCallable } from "firebase/functions";
import { getAnalytics, logEvent } from "firebase/analytics";

export default function EstimateForm() {
  const recaptchaRef = useRef(null);

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
  const onFormSubmit = httpsCallable(functions, "onFormSubmit");

  const handleChange = (e) => {
    console.log("handleChange:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErr = {};
    if (!formData.name.trim()) newErr.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErr.email = "Invalid email";
    if (!/^\d{10}$/.test(formData.phone)) newErr.phone = "Enter 10-digit phone";
    if (!formData.address.trim() || formData.address.length < 5)
      newErr.address = "Enter a valid address";
    return newErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔔 handleSubmit fired");
    setStatus("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);

    try {
      const analytics = getAnalytics();
      logEvent(analytics, "form_submit", {
        category: "lead_generation",
        label: "EstimateForm",
      });
    } catch (err) {
      console.warn("Analytics not initialized:", err);
    }
    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();
    console.log("reCAPTCHA token:", token);

    try {
      const { data } = await onFormSubmit({
        ...formData,
        recaptchaToken: token,
      });
      console.log("Firebase result:", data);
      setStatus("SUCCESS");

      if (window.gtag) {
        window.gtag("event", "form_submit", {
          event_category: "lead_generation",
          event_label: `EstimateForm - ${window.location.pathname}`,
          value: 1,
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });

      setTimeout(() => navigate("/thank-you"), 2000);
    } catch (error) {
      console.error("Firebase submission error:", error);
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

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY}
            size="invisible"
            ref={recaptchaRef}
          />

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
    </div>
  );
}
