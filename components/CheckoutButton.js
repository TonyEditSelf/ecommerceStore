"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useCartStore } from "@/store/cartStore";
import { trackEvent } from "@/lib/events";

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function CheckoutButton() {
  const { items, clearCart } = useCartStore();
  const [status, setStatus] = useState("");
  const [needsGoogleSignIn, setNeedsGoogleSignIn] = useState(false);
  const router = useRouter();

  async function checkout() {
    setStatus("Creating order");
    setNeedsGoogleSignIn(false);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        products: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        setNeedsGoogleSignIn(true);
        setStatus("Sign in with Google to continue checkout.");
        return;
      }
      setStatus(result.error || "Checkout failed");
      return;
    }

    await loadRazorpay();
    const { order, razorpayOrder, keyId } = result.data;
    const razorpay = new window.Razorpay({
      key: keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Ecommerce Store",
      order_id: razorpayOrder.id,
      handler: async (payment) => {
        const verifyResponse = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            orderId: order._id,
            razorpayOrderId: payment.razorpay_order_id,
            razorpayPaymentId: payment.razorpay_payment_id,
            razorpaySignature: payment.razorpay_signature,
          }),
        });
        const verifyResult = await verifyResponse.json();
        if (verifyResult.data?.verified) {
          clearCart();
          setStatus("Payment successful");
          trackEvent("purchase_completed", { orderId: order._id });
        } else {
          setStatus("Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => setStatus("Payment cancelled"),
      },
    });

    razorpay.open();
  }

  async function handleAuthSuccess() {
    // Fire custom event so Navbar re-fetches user
    window.dispatchEvent(new Event("user-auth-changed"));
    await checkout();
  }

  async function handleCheckout() {
    trackEvent("checkout_started", { itemsCount: items.length });
    await checkout();
  }

  return (
    <>
      <button
        onClick={handleCheckout}
        className="mt-6 w-full rounded-md bg-textPrimary px-5 py-3 text-sm font-semibold text-white"
      >
        Checkout
      </button>
      {needsGoogleSignIn && (
        <div className="mt-4 rounded-md border border-borderSoft bg-background p-4">
          <GoogleSignInButton onSuccess={handleAuthSuccess} />
        </div>
      )}
      {status && (
        <p className="mt-3 text-center text-sm text-textSecondary">{status}</p>
      )}
    </>
  );
}
