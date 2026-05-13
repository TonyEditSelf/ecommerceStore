"use client";

import { useEffect, useRef, useState } from "react";

export default function GoogleSignInButton({ onSuccess }) {
  const buttonRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setMessage("Google login is not configured.");
      return;
    }

    function renderButton() {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setMessage("Signing in");
          const authResponse = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ credential: response.credential }),
          });
          const result = await authResponse.json();
          if (!authResponse.ok) {
            setMessage(result.error || "Google sign-in failed");
            return;
          }
          setMessage("");
          onSuccess?.(result.data);
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 300,
      });
    }

    if (window.google) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.body.appendChild(script);
  }, [onSuccess]);

  return (
    <div>
      <div ref={buttonRef} />
      {message && <p className="mt-3 text-center text-sm text-textSecondary">{message}</p>}
    </div>
  );
}
