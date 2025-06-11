import type { Metadata } from "next";
import "./globals.css";
import { Public_Sans } from "next/font/google";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "My Finance App",
  description: "This is a finance app that helps you manage your finances.",
};

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
