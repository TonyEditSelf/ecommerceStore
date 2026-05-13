"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-5 inline-flex items-center gap-2 rounded-md border border-borderSoft bg-white px-4 py-2 text-sm font-semibold text-textPrimary shadow-subtle transition hover:bg-card"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
