import Link from "next/link";
import { Logotype } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/siteConfig";

const cols: Array<{ heading: string; items: Array<{ label: string; href: string; external?: boolean }> }> = [
  {
    heading: "Product",
    items: [
      { label: "Add to Chrome", href: siteConfig.chromeStoreUrl, external: true },
      { label: "Pricing", href: "/pricing" },
      { label: "What's new", href: "/#" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "How it works", href: "/#how" },
      { label: "Examples", href: "/#use-cases" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "Contact", href: siteConfig.links.contact, external: true },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "Twitter / X", href: siteConfig.links.twitter, external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logotype />
            <p className="max-w-xs text-sm text-muted">
              Your browser, on autopilot. Tell it what to do — it shops, books, researches, and fills
              the forms for you.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.heading}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
                {c.heading}
              </div>
              <ul className="space-y-3">
                {c.items.map((i) => (
                  <li key={i.label}>
                    {i.external ? (
                      <a href={i.href} target="_blank" rel="noreferrer" className="text-sm text-ink-soft hover:text-ink">
                        {i.label}
                      </a>
                    ) : (
                      <Link href={i.href} className="text-sm text-ink-soft hover:text-ink">
                        {i.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Agentronics — browse less, do more.</div>
          <div>Made for the agentic web.</div>
        </div>
      </div>
    </footer>
  );
}
