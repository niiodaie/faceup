import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { initGA, trackPage } from "./lib/analytics";
import { BrowserRouter } from "react-router-dom";

// Initialize GA once
initGA();

// Listen for SPA page navigation
function AnalyticsListener() {
  const location = window.location;

  // Track first load
  trackPage(location.pathname);

  // Track routing changes using popstate & pushState hacks
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
