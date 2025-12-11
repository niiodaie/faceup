import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { initGA, trackPage } from "./lib/analytics";

// Initialize once
initGA();

// Track SPA navigation
function AnalyticsListener() {
  trackPage(window.location.pathname);

  window.addEventListener("popstate", () => {
    trackPage(window.location.pathname);
  });

  const originalPush = history.pushState;
  history.pushState = function (...args) {
    originalPush.apply(this, args);
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
