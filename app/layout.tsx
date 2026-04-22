import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.siteUrl,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ClerkProvider
            afterSignOutUrl="/"
            appearance={{
              variables: {
                colorPrimary: "#6366F1",
                colorBackground: "var(--color-card)",
                colorText: "var(--color-ink)",
                colorTextSecondary: "var(--color-muted)",
                colorInputBackground: "var(--color-paper-soft)",
                colorInputText: "var(--color-ink)",
                colorTextOnPrimaryBackground: "#FFFFFF",
                colorNeutral: "var(--color-ink)",
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-line rounded-2xl card-shadow",
                footer: "hidden",
                footerAction: "hidden",
                logoBox: "hidden",
                headerTitle: "font-display text-ink",
                headerSubtitle: "text-ink-soft",
                formButtonPrimary: "bg-ember hover:bg-ember-soft text-white normal-case",
                socialButtonsBlockButton: "border border-line bg-card hover:bg-paper-soft text-ink",
                formFieldInput: "bg-paper-soft border border-line text-ink",
                formFieldLabel: "text-ink-soft",
                dividerLine: "bg-line",
                dividerText: "text-muted",
                identityPreviewText: "text-ink",
                identityPreviewEditButton: "text-ember hover:text-ember-soft",
              },
            }}
          >
            <LenisProvider>{children}</LenisProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
