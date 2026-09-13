import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | LOLLY Agence",
  description:
    "Contactez LOLLY pour discuter de votre projet. Consulting, formation, production : nous sommes prêts à relever vos défis.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contacter LOLLY Agence",
    description: "Parlons de votre projet de communication, de production ou de formation à Dakar.",
    url: "https://lolly.sn/contact",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
