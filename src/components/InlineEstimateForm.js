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
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (formData.phone.replace(/\D/g, "").length !== 10)
      errs.phone = "Enter a valid 10-digit phone number";
    if (!formData.address.trim() || formData.address.length < 5)
      errs.address = "Enter a street address (min 5 chars) or 5-digit ZIP";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔔 Inline handleSubmit fired");
    setStatus("");
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);

    if (!recaptchaRef.current) {
      console.error("reCAPTCHA not initialized");
      setStatus("ERROR");
      setIsLoading(false);
      return;
    }
    let token;
    try {
      token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
    } catch (err) {
      console.error("reCAPTCHA execution failed:", err);
      setStatus("ERROR");
      setIsLoading(false);
      return;
    }

    // Call your Cloud Function
    try {
      const { data } = await onFormSubmit({
        ...formData,
        recaptchaToken: token,
      });
      console.log("Function result:", data);
      setStatus("SUCCESS");
      window.gtag?.("event", "form_submit", {
        event_category: "lead_generation",
        event_label: `InlineEstimateForm – ${window.location.pathname}`,
        value: 1,
      });
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
      onSuccess?.();
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const siteKey = process.env.REACT_APP_RECAPTCHA_SITEKEY;

  return (
    <section id="estimate-form" className="form-container">
      <h2>Get a Free Estimate</h2>
      <form onSubmit={handleSubmit} noValidate>
        {["name", "email", "phone", "address"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input
              type={
                field === "email" ? "email" : field === "phone" ? "tel" : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
            {errors[field] && <span className="error">{errors[field]}</span>}
          </label>
        ))}

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
          {isLoading ? "Submitting…" : "Submit"}
        </button>
      </form>

      {siteKey ? (
        <ReCAPTCHA sitekey={siteKey} size="invisible" ref={recaptchaRef} />
      ) : (
        <p className="error">
          reCAPTCHA site key is missing. Please check your environment config.
        </p>
      )}

      {status === "SUCCESS" && (
        <p className="success">We’ll contact you shortly.</p>
      )}
      {status === "ERROR" && (
        <p className="error">Something went wrong. Try again.</p>
      )}
    </section>
  );
}
