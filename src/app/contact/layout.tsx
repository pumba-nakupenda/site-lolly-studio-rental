import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | LOLLY Agence",
  description:
    "Contactez LOLLY pour discuter de votre projet. Consulting, formation, production : nous sommes prêts à relever vos défis.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
