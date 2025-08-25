import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { functions } from "../firebase";
import ReCAPTCHA from "react-google-recaptcha";
import { httpsCallable } from "firebase/functions";
import { getAnalytics, logEvent } from "firebase/analytics";

export default function EstimateForm() {
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
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

    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
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
      console.log("reCAPTCHA token:", token);
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
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITEKEY;

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <section className="form-container">
          <h2>Get a Free Estimate</h2>
          <form onSubmit={handleSubmit} noValidate>
            {["name", "email", "phone", "address"].map((field) => (
              <label key={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
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
                {errors[field] && (
                  <span className="error">{errors[field]}</span>
                )}
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
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
          {siteKey ? (
            <ReCAPTCHA sitekey={siteKey} size="invisible" ref={recaptchaRef} />
          ) : (
            <p className="error">
              reCAPTCHA site key is missing. Please check your environment
              config.
            </p>
          )}

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
