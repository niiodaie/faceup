// Centralized affiliate link builder

const AMAZON_ID = import.meta.env.VITE_AMAZON_AFFILIATE_ID;
const SEPHORA_ID = import.meta.env.VITE_SEPHORA_AFFILIATE_ID;
const KOHLS_ID = import.meta.env.VITE_KOHLS_AFFILIATE_ID;

export function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ID}`;
}

export function sephoraLink(path) {
  return `https://www.sephora.com${path}?om_mmc=${SEPHORA_ID}`;
}

export function kohlsLink(productId) {
  return `https://www.kohls.com/product/prd-${productId}.jsp?aff=${KOHLS_ID}`;
}
