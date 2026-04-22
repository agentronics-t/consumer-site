import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Sign in · Agentronics" };

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen items-center justify-center px-6 pt-28 pb-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[320px] paper-dots opacity-70" />
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Welcome back.
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Sign in to top up credits and pair your extension.
            </p>
          </div>

          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/signup"
            fallbackRedirectUrl="/dashboard"
          />

          <p className="mt-6 text-center text-sm text-muted">
            New here?{" "}
            <Link href="/signup" className="font-medium text-ember hover:text-ember-soft">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
