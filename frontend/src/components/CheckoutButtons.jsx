// components/CheckoutButtons.jsx
import { useCheckout } from "../lib/useCheckout";
import { useUser } from "@supabase/auth-helpers-react";

export default function CheckoutButtons() {
  const { user } = useUser();
  const { startCheckout } = useCheckout();

  const monthlyPrice = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
  const yearlyPrice = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;

  function handleCheckout(priceId) {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    startCheckout({ userId: user.id, priceId });
  }

  return (
    <>
      <button
        onClick={() => handleCheckout(monthlyPrice)}
        className="w-full px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl shadow hover:bg-pink-700 transition"
      >
        Get Monthly – $4.99 / month
      </button>

      <button
        onClick={() => handleCheckout(yearlyPrice)}
        className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 transition mt-3"
      >
        Get Yearly – $36 / year
      </button>
    </>
  );
}
