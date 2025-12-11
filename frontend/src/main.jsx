import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { initGA, trackPage } from "./lib/analytics";

// Initialize Google Analytics once
initGA();

// Listen for SPA pageviews
function AnalyticsListener() {
  trackPage(window.location.pathname);

  window.addEventListener("popstate", () => {
    trackPage(window.location.pathname);
  });

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    trackPage(window.location.pathname);
  };

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsListener />
      <App />
    </BrowserRouter>
  </StrictMode>
);
