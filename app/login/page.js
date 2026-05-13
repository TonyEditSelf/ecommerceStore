import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold text-textPrimary">Welcome back to Ecommerce Store</h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-textSecondary">
          A polished authentication screen ready to connect with your future backend.
        </p>
      </section>
      <div>
        <AuthForm mode="login" />
        <p className="mt-5 text-center text-sm text-textSecondary">
          New here? <Link href="/signup" className="font-semibold text-primary">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
