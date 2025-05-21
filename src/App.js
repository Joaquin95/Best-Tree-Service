import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

ReactGA.initialize("G-XXXXXXX"); // Replace with your Google Analytics Measurement ID

function App() {
  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

  return (
    <div>
      <Home />
      <About />
      <Contact />
    </div>
  );
}
// This is the main entry point of the application
// It initializes Google Analytics and sets up the main layout of the app


export default App;
