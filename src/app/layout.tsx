import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agence de Conseil en Communication | LOLLY Agence",
  description:
    "LOLLY est votre partenaire stratégique pour dominer le paysage digital sénégalais. Stratégie 360, Branding, Formation et Production Vidéo.",
  keywords:
    "communication, digital, sénégal, branding, formation, vidéo",
  openGraph: {
    title: "Agence de Conseil en Communication | LOLLY Agence",
    description:
      "LOLLY est votre partenaire stratégique pour dominer le paysage digital sénégalais. Stratégie 360, Branding, Formation et Production Vidéo.",
    url: "https://lolly.sn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOLLY Agency",
    description:
      "Agence de communication et formation d'élite au Sénégal.",
  },
  other: {
    "theme-color": "#FFD100",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={epilogue.className}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=MuseoModerno:ital,wght@1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-on-surface antialiased overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary-fixed focus:text-on-primary-fixed focus:px-6 focus:py-3 focus:font-bold focus:uppercase focus:text-xs focus:tracking-widest">
          Aller au contenu principal
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
