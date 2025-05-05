import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Finance App",
  description: "This is a finance app that helps you manage your finances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
