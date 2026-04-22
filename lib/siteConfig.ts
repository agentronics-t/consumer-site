export const siteConfig = {
  name: "Agentronics",
  domain: "agentronics.com",
  tagline: "Tell your browser what to do. It does it.",
  description:
    "Agentronics is a Chrome extension that browses the web for you — shop, research, book, compare — on any site, with your favorite AI model.",
  chromeStoreUrl:
    process.env.NEXT_PUBLIC_CHROME_STORE_URL ??
    "https://chromewebstore.google.com/detail/agentronics/PLACEHOLDER",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  links: {
    twitter: "https://twitter.com/agentronics",
    contact: "mailto:agentronics.help@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
