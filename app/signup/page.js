import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Create account</p>
        <h1 className="mt-3 text-4xl font-semibold text-textPrimary">Start a refined shopping experience</h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-textSecondary">
          Signup UI with spacious fields, clear hierarchy, and future integration points.
        </p>
      </section>
      <div>
        <AuthForm mode="signup" />
        <p className="mt-5 text-center text-sm text-textSecondary">
          Already have an account? <Link href="/login" className="font-semibold text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
}
