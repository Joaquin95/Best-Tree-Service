import React, { useState, useRef } from "react";
import { functions } from "../firebase";
import { httpsCallable } from "firebase/functions";
import ReCAPTCHA from "react-google-recaptcha";

export default function InlineEstimateForm({ onSuccess }) {
  const recaptchaRef = useRef(null);
  const onFormSubmit = httpsCallable(functions, "onFormSubmit");

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const validateForm = () => {
    const { name, email, phone, address } = formData;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    const addrTrim = address.trim();
    const isZip = /^\d{5}$/.test(addrTrim);
    if (!isZip && addrTrim.length < 5) {
      newErrors.address =
        "Enter a street address (min 5 chars) or a 5-digit ZIP code";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔔 Inline handleSubmit fired");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setStatus("");

    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      
      if (!recaptchaRef.current) {
        console.error("reCAPTCHA not initialized");
        setStatus("ERROR");
        setIsLoading(false);
        return;
      }

      const res = await onFormSubmit({
        ...formData,
        recaptchaToken: token,
      });

      console.log("Function result:", res.data);
      setStatus("SUCCESS");

      if (window.gtag) {
        const pagePath = window.location.pathname;
        window.gtag("event", "form_submit", {
          event_category: "lead_generation",
          event_label: `InlineEstimateForm – ${pagePath}`,
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

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="estimate-form" className="form-container">
      <h2>Get a Free Estimate</h2>
      <form onSubmit={handleSubmit} noValidate>
        {["name", "email", "phone", "address", "message"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            {field === "message" ? (
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                maxLength={3000}
                placeholder="Please provide details about your tree service needs."
              />
            ) : (
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "phone"
                    ? "tel"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            )}
            {errors[field] && <span className="error">{errors[field]}</span>}
          </label>
        ))}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting…" : "Submit"}
        </button>
        {status === "SUCCESS" && (
          <p className="success">We’ll contact you shortly.</p>
        )}
        {status === "ERROR" && (
          <p className="error">Something went wrong. Try again.</p>
        )}
      </form>
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY}
        size="invisible"
        ref={recaptchaRef}
      />
    </section>
  );
}
