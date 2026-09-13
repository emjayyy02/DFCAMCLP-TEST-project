import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/identity/login-form";

export const metadata: Metadata = { title: "Sign in — DFCAMCLP Portal" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10 sm:px-8">
      <section
        aria-labelledby="login-title"
        className="w-full max-w-md border-t-4 border-primary bg-white px-6 py-8 shadow-[0_16px_45px_rgba(32,40,35,0.08)] sm:px-9 sm:py-10"
      >
        <p className="text-sm font-semibold tracking-[0.12em] text-primary uppercase">
          DFCAMCLP
        </p>
        <h1 id="login-title" className="mt-3 text-3xl font-semibold">
          Portal sign in
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Use a development account to verify secure authentication.
        </p>

        <LoginForm />

        <div className="mt-7 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
          <p>Account activation and recovery are not available in P2-M3.</p>
          <Link
            href="/"
            className="mt-2 inline-block font-semibold text-primary underline decoration-1 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Return to public home
          </Link>
        </div>
      </section>
    </main>
  );
}
