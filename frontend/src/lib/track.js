import { trackEvent } from "./analytics";

/** FaceUp Event Tracking — full SaaS analytics **/

// ---------- Scan Funnel ----------
export const trackScanStarted = () =>
  trackEvent("scan_started");

export const trackScanCompleted = (duration) =>
  trackEvent("scan_completed", { duration });

export const trackScanFailed = (reason) =>
  trackEvent("scan_failed", { reason });


// ---------- Hairstyle / Beauty Interaction ----------
export const trackHairstyleSuggestionViewed = (styleName) =>
  trackEvent("hairstyle_viewed", { style: styleName });

export const trackBeforeAfterOpened = () =>
  trackEvent("before_after_opened");


// ---------- Checkout Funnel ----------
export const trackPricingViewed = () =>
  trackEvent("view_pricing");

export const trackUpgradeMonthly = () =>
  trackEvent("upgrade_click", { plan: "monthly" });

export const trackUpgradeYearly = () =>
  trackEvent("upgrade_click", { plan: "yearly" });

export const trackStripeCheckoutStarted = (priceId) =>
  trackEvent("stripe_checkout_started", { priceId });

export const trackStripeCheckoutSuccess = (planType) =>
  trackEvent("stripe_checkout_success", { plan: planType });

export const trackStripeCheckoutCanceled = () =>
  trackEvent("stripe_checkout_canceled");


// ---------- Subscription Lifecycle ----------
export const trackSubscriptionActive = (plan) =>
  trackEvent("subscription_active", { plan });

export const trackSubscriptionCanceled = (plan) =>
  trackEvent("subscription_canceled", { plan });


// ---------- UI Engagement ----------
export const trackCameraOpened = () =>
  trackEvent("camera_opened");

export const trackScreenshotTaken = () =>
  trackEvent("screenshot_taken");

export const trackMenuOpened = (menu) =>
  trackEvent("menu_opened", { menu });
