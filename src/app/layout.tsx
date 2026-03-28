import type { Metadata } from "next";
import { Lexend, Public_Sans } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TrustLayer",
  description: "Identity verification for the Ethiopian digital economy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${lexend.variable} ${publicSans.variable} font-body bg-background text-on-surface antialiased`}>
        {children}
      </body>
    </html>
  );
}
