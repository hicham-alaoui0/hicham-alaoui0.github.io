import type { Metadata } from "next";
import { site, profile } from "@/lib/data";
import "./globals.css";

const title = "Hicham Alaoui — AI Engineer · LLM Systems for Finance";
const description =
  "AI Engineer building LLM agents, retrieval (RAG), and evaluation systems for finance — on top of production ML and quant-risk modeling.";

// Social preview image is generated at build time by app/opengraph-image.tsx
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s",
  },
  description,
  keywords: [
    "AI Engineer",
    "LLM Agents",
    "RAG",
    "LLM Evaluation",
    "Machine Learning",
    "Quantitative Risk",
    "MLOps",
    "Hicham Alaoui",
  ],
  authors: [{ name: profile.name, url: site.url }],
  openGraph: {
    title,
    description: "LLM agents, RAG, and evals for finance — built on production ML.",
    url: site.url,
    siteName: "Hicham Alaoui — Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "LLM agents, RAG, and evals for finance — built on production ML.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI Engineer",
  worksFor: { "@type": "Organization", name: "Société Générale ATS" },
  email: `mailto:${profile.email}`,
  url: site.url,
  address: { "@type": "PostalAddress", addressCountry: "MA" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "INSEA — National Institute of Statistics & Applied Economics",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    "Large Language Models",
    "LLM Agents",
    "Retrieval-Augmented Generation",
    "Machine Learning",
    "Quantitative Risk",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
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
