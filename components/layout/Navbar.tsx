"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { Logotype } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/siteConfig";

const navLinks = [
  { href: "/#how", label: "How it works" },
  { href: "/#use-cases", label: "What it can do" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled ? "backdrop-blur-md bg-paper/75 border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2" aria-label="Agentronics home">
          <Logotype />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[14px] text-ink-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign in
            </ButtonLink>
            <ButtonLink href={siteConfig.chromeStoreUrl} external variant="primary" size="sm">
              Add to Chrome
            </ButtonLink>
          </Show>
          <Show when="signed-in">
            <ButtonLink href="/dashboard" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Dashboard
            </ButtonLink>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
