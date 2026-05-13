"use client";

import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function GoogAuthPage() {
  function handleSuccess(userData) {
    const destination = userData.role === "admin" ? "/admin" : "/";
    window.location.assign(destination);
  }

  return (
    <div className="mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Authentication</p>
          <h1 className="mt-3 text-4xl font-semibold text-textPrimary">Sign in to Ecommerce Store</h1>
          <p className="mt-4 text-base leading-8 text-textSecondary">
            Use your Google account to access your profile, track orders, and manage your experience.
          </p>
        </div>
        <div className="mt-10 flex justify-center rounded-md border border-borderSoft bg-card p-10 shadow-soft">
          <GoogleSignInButton onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
