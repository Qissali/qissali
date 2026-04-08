import type { Metadata } from "next";
import { OrderModalProvider } from "@/components/Modal";
import { Dancing_Script, Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Qissali — Mon histoire islamique personnalisée",
  description:
    "Crée une histoire unique pour ton enfant : univers magiques, PDF illustré, livré par email.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nunito.variable} ${playfair.variable} ${dancing.variable}`}>
      <body className="antialiased">
        <OrderModalProvider>{children}</OrderModalProvider>
      </body>
    </html>
  );
}
