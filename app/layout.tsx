import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Mono } from "next/font/google";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
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
    <html lang="en" suppressHydrationWarning className={spaceMono.variable}>
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
                colorBackground: "var(--color-bg-card)",
                colorText: "var(--color-text-primary)",
                colorTextSecondary: "var(--color-text-muted)",
                colorInputBackground: "var(--color-bg-elevated)",
                colorInputText: "var(--color-text-primary)",
                colorTextOnPrimaryBackground: "#FFFFFF",
                colorNeutral: "var(--color-text-primary)",
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-bg-card border border-border rounded-2xl card-shadow",
                footer: "hidden",
                footerAction: "hidden",
                logoBox: "hidden",
                headerTitle: "font-sans text-text-primary",
                headerSubtitle: "text-text-secondary",
                formButtonPrimary:
                  "bg-border-glow hover:opacity-90 text-white normal-case",
                socialButtonsBlockButton:
                  "border border-border bg-bg-card hover:bg-bg-card-hover text-text-primary",
                formFieldInput:
                  "bg-bg-elevated border border-border text-text-primary",
                formFieldLabel: "text-text-secondary",
                dividerLine: "bg-border",
                dividerText: "text-text-muted",
                identityPreviewText: "text-text-primary",
                identityPreviewEditButton:
                  "text-border-glow hover:opacity-80",
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
