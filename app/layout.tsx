import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asedatruckmeet.se"),
  title: {
    default: "Åseda Truckmeet 2027",
    template: "%s | Åseda Truckmeet",
  },
  description:
    "Modern eventplattform för Åseda Truckmeet med biljetter, lastbilsgalleri, program, karta, partners och publikens val.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Åseda Truckmeet 2027",
    description:
      "Småland. Lastbilar. Folkfest. 2-3 juli 2027.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Åseda Truckmeet 2027",
    description: "Småland. Lastbilar. Folkfest.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
