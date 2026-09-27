import type { Metadata } from "next";
import { site, profile } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Hicham Alaoui — Data Scientist & EQD Trading Analyst",
    template: "%s",
  },
  description:
    "Applied Data Scientist building production ML and decision systems for finance, risk, and analytics. EVT risk models, data pipelines, LLM agents.",
  keywords: [
    "Data Scientist",
    "Quantitative Finance",
    "Machine Learning",
    "EVT",
    "Data Engineering",
    "MLOps",
    "Hicham Alaoui",
  ],
  authors: [{ name: "Hicham Alaoui", url: site.url }],
  openGraph: {
    title: "Hicham Alaoui — Data Scientist & EQD Trading Analyst",
    description:
      "Production ML and decision systems for finance, risk, and analytics.",
    url: site.url,
    siteName: "Hicham Alaoui — Portfolio",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hicham Alaoui — Data Scientist" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "Hicham Alaoui — Data Scientist & EQD Trading Analyst",
    description:
      "Production ML and decision systems for finance, risk, and analytics.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hicham Alaoui",
  jobTitle: "Data Scientist & EQD Trading Analyst",
  worksFor: { "@type": "Organization", name: "Société Générale ATS" },
  email: `mailto:${profile.email}`,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Rabat", addressCountry: "MA" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "INSEA — National Institute of Statistics & Applied Economics",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    "Machine Learning",
    "Quantitative Finance",
    "Extreme Value Theory",
    "Data Engineering",
    "MLOps",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
