// lib/useCheckout.js
export function useCheckout() {
  async function startCheckout({ userId, priceId }) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            priceId,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/pricing`,
          }),
        }
      );

      const data = await response.json();

      if (!data.url) {
        throw new Error("Failed to get Stripe checkout URL");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Payment failed — please try again.");
    }
  }

  return { startCheckout };
}
