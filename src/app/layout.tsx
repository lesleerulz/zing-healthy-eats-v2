import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zing Healthy Treats | Artisanal Granola",
  description: "Premium breakfast nuts, granola, and trail mixes.",
};

import ConditionalNavbar from "@/components/ConditionalNavbar";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <ConditionalNavbar />
          <CartDrawer />
          <SmoothScroll>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
