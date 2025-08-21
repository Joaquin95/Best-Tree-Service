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
import Gallery from "./pages/Gallery";

ReactGA.initialize("G-7WL7RH72E5");

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
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/services" element={<Services />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}

export default App;
