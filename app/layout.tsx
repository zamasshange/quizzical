import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL, absoluteUrl, SITE_TAGLINE } from "@/lib/seo";
import { BASE_KEYWORDS, BRAND_KEYWORDS } from "@/lib/seoKeywords";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Quizzical (quizzical.site) — free quiz games online. Picture quizzes, trivia, flags, sports, movies, and AI games by BDL Corp. Play quizzical games and learn after every answer.",
  applicationName: SITE_NAME,
  keywords: [...BASE_KEYWORDS, ...BRAND_KEYWORDS],
  authors: [
    { name: "BDL Corp", url: SITE_URL },
    { name: "Zama Shange", url: SITE_URL },
    { name: "Sonke AI", url: SITE_URL },
    { name: "Burdolar", url: SITE_URL },
  ],
  creator: "BDL Corp · Zama Shange · Sonke AI · Burdolar",
  publisher: "BDL Corp",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Quizzical Games Online`,
    description:
      "Quizzical games — free picture quizzes, trivia, flags, sports, and AI quiz generator at quizzical.site.",
    images: [
      {
        url: absoluteUrl("/logo.png"),
        width: 512,
        height: 512,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Quizzical Games`,
    description: "Quizzical games — free quiz and trivia at quizzical.site.",
    images: [absoluteUrl("/logo.png")],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${nunito.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ClerkProvider signInUrl="/signin" signUpUrl="/signup">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
