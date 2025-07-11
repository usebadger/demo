import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BadgeChangeProvider from "./BadgeChangeProvider";
import { PollingProvider } from "../lib/PollingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopDemo | Simple Ecommerce Store",
  description:
    "A simple ecommerce store with products, checkout, and account management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PollingProvider>
          <BadgeChangeProvider>{children}</BadgeChangeProvider>
        </PollingProvider>
      </body>
    </html>
  );
}
