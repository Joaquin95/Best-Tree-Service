import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import ThankYou from "./pages/ThankYou";
import TreeRemoval from "./pages/TreeRemoval";
import Home from "./pages/Home";
import EstimateForm from "./pages/EstimateForm";
import StumpGrinding from "./pages/StumpGrinding";
import TreeTrimming from "./pages/TreeTrimming";
import Services from "./pages/Services";
ReactGA.initialize("G-XXXXXXX"); // Replace with your Google Analytics Measurement ID

function App() {
  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tree-removal" element={<TreeRemoval />} />
      <Route path="/estimate" element={<EstimateForm />} />
      <Route path="/stump-grinding" element={<StumpGrinding />} />
      <Route path="/tree-trimming" element={<TreeTrimming />} />
      <Route path="/services" element={<Services />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}

export default App;
