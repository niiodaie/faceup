export function trackAffiliateClick(provider, product) {
  if (window.gtag) {
    window.gtag('event', 'affiliate_click', {
      provider,
      product,
    });
  }
}
