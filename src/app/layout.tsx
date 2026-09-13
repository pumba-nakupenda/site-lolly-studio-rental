import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "./fonts/Montserrat-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Montserrat-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Montserrat-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});
const lato = localFont({
  src: [
    { path: "./fonts/Lato-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Lato-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lato",
  display: "swap",
});
const museo = localFont({
  src: "./fonts/MuseoModerno-BlackItalic.woff2",
  weight: "900",
  style: "italic",
  variable: "--font-museo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lolly.sn"),
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : undefined,
  title: "Agence de Conseil en Communication | LOLLY Agence",
  description:
    "LOLLY relie conseil, production, formation et location audiovisuelle pour faire avancer les entreprises et les créateurs à Dakar.",
  keywords:
    "communication, digital, sénégal, branding, formation, vidéo",
  openGraph: {
    title: "Agence de Conseil en Communication | LOLLY Agence",
    description:
      "Conseil, production, formation et location audiovisuelle à Dakar : trouvez le bon point de départ avec LOLLY.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOLLY Agency",
    description:
      "Conseil, production, formation et location audiovisuelle à Dakar.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FED700",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${lato.variable} ${museo.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-on-surface antialiased overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary-fixed focus:text-on-primary-fixed focus:px-6 focus:py-3 focus:font-bold focus:uppercase focus:text-xs focus:tracking-widest">
          Aller au contenu principal
        </a>
        {children}
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
