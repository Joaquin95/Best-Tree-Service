import React, { useState } from "react";

export default function InlineEstimateForm({ onSuccess }) {
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
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.address.trim() || formData.address.length < 5)
      newErrors.address = "Enter a valid address";
    if (!/\d{5}(-\d{4})?$/.test(formData.address))
      newErrors.address = "Enter a valid ZIP code";
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
      const response = await fetch("https://formspree.io/f/mgvkbynr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _replyto: "besttreeservicedfw@gmail.com",
          _subject: "New Tree service quote Submitted 📩 - J.M.",
        }),
      });

      setIsLoading(false);

      if (response.ok) {
        setStatus("Success");
        if (window.gtag) {
          const pagePath = window.location.pathname;
          window.gtag("event", "form_submit", {
            event_category: "lead_generation",
            event_label: `InlineEstimateForm - ${pagePath}`,
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
    <section id="estimate-form" className="form-container">
      <h2>Get a Free Estimate</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
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
                required
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
        <button
          type="submit"
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {status === "SUCCESS" && (
        <p className="success">We’ll contact you shortly.</p>
      )}
      {status === "ERROR" && (
        <p className="error">Something went wrong. Try again.</p>
      )}
    </section>
  );
}
