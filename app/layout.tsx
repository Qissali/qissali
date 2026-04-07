import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { OrderModalProvider } from "@/components/Modal";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
    <html lang="fr" className={`${nunito.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <OrderModalProvider>
          <Nav />
          <div className="pt-[120px]">{children}</div>
        </OrderModalProvider>
      </body>
    </html>
  );
}
