import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { onFormSubmit } from "../firebaseFunctions";
import { useNavigate } from "react-router-dom";
import { getAnalytics, logEvent } from "firebase/analytics";

export default function InlineEstimateForm({ onSuccess }) {
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

  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const analytics = getAnalytics();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔔 Inline handleSubmit fired");
    setStatus("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!recaptchaRef.current) {
      console.error("reCAPTCHA ref not ready");
      setStatus("ERROR");
      return;
    }

    setIsLoading(true);
    let token;
    try {
      token = await recaptchaRef.current.execute();

      recaptchaRef.current.reset();
    } catch (err) {
      console.error("reCAPTCHA execution failed:", err);
      setStatus("ERROR");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await onFormSubmit({
        ...formData,
        recaptchaToken: token,
      });
      console.log("Function result:", data);
      logEvent(analytics, "form_submit", {
        form_type: "inline_estimate",
        path: window.location.pathname,
      });

      setStatus("SUCCESS");
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
      onSuccess?.();
      navigate("/thank-you");
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
