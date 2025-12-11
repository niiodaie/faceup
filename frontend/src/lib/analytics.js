// src/lib/analytics.js
export const GA_ID = "G-YHXYD6VR5R";

export function initGA() {
  if (!GA_ID) return;

  // Inject GA script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // Init GA after script loads
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_ID, {
      send_page_view: false, // SPA fix
    });
  };
}

// Track SPA page views
export function trackPage(path) {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

// Track important user events
export function trackEvent(name, params = {}) {
  if (!window.gtag) return;
  window.gtag("event", name, params);
}
