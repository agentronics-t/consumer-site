import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = { title: "Create account · Agentronics" };

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen items-center justify-center px-6 pt-28 pb-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-[320px] paper-dots opacity-70" />
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Let your browser do the work.
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Sign up, top up $10, delegate your first task.
            </p>
          </div>

          <SignUp
            routing="path"
            path="/signup"
            signInUrl="/login"
            fallbackRedirectUrl="/dashboard"
          />

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-border-glow hover:text-border-glow">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
