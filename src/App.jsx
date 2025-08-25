import React, { useEffect } from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ReactGA from "react-ga4";
import Navbar from "./components/Navbar";
import ThankYou from "./pages/ThankYou";
import TreeRemoval from "./pages/TreeRemoval";
import Home from "./pages/Home";
import EstimateForm from "./pages/EstimateForm";
import StumpGrinding from "./pages/StumpGrinding";
import TreeTrimming from "./pages/TreeTrimming";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import ServiceArea from "./pages/ServiceArea";
import 'leaflet/dist/leaflet.css';


ReactGA.initialize("G-7WL7RH72E5");

function App() {
  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tree-removal" element={<TreeRemoval />} />
          <Route path="/estimate" element={<EstimateForm />} />
          <Route path="/service-area" element={<ServiceArea />} />
          <Route path="/stump-grinding" element={<StumpGrinding />} />
          <Route path="/tree-trimming" element={<TreeTrimming />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/services" element={<Services />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
