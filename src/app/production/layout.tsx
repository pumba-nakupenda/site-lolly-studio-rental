import { CartProvider, CartPanel, CartBadge } from "@/components/QuoteCart";

export default function ProductionLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartPanel />
      <CartBadge />
    </CartProvider>
  );
}
