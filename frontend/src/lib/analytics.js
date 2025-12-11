// src/lib/analytics.js
export const GA_ID = "G-YHXYD6VR5R";

export function initGA() {
  if (!GA_ID) return;

  // Load GA script dynamically
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag("js", new Date());

    // Important: disable automatic page view → SPA needs manual
    gtag("config", GA_ID, { send_page_view: false });
  };
}

// Track SPA page navigation
export function trackPage(path) {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// Custom events (scan complete, checkout, upgrades, etc.)
export function trackEvent(name, params = {}) {
  if (!window.gtag) return;
  window.gtag("event", name, params);
}
