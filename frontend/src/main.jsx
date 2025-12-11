import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { initGA, trackPage } from "./lib/analytics";

// Initialize Google Analytics once
initGA();

function AnalyticsListener() {
  useEffect(() => {
    // Track initial page load
    trackPage(window.location.pathname);

    // Track back/forward navigation
    const popHandler = () => trackPage(window.location.pathname);
    window.addEventListener("popstate", popHandler);

    // Track pushState & replaceState
    const originalPush = history.pushState;
    history.pushState = function (...args) {
      originalPush.apply(this, args);
      trackPage(window.location.pathname);
    };

    const originalReplace = history.replaceState;
    history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      trackPage(window.location.pathname);
    };

    return () => {
      window.removeEventListener("popstate", popHandler);
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AnalyticsListener />
    <App />
  </StrictMode>
);
