import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Endless Puzzle Game",
  description: "A fun and challenging Endless puzzle game",

  icons: {
    icon: [
      {
        url: "/nessy-image.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/nessy-image.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/nessy-image.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/nessy-image.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
