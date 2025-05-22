import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EstimateForm from "./pages/EstimateForm";

ReactGA.initialize("G-XXXXXXX"); // Replace with your Google Analytics Measurement ID

function App() {
  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/estimate" element={<EstimateForm />} />
    </Routes>
  );
}
// This is the main entry point of the application
// It initializes Google Analytics and sets up the main layout of the app

export default App;
