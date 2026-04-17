import { CartProvider, CartPanel, CartBadge } from "@/components/QuoteCart";

export default function RentalLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartPanel />
      <CartBadge />
    </CartProvider>
  );
}
