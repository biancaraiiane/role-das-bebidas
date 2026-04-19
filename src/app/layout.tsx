import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rolê das Bebidas",
  description: "Sistema de ranking de bebidas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}