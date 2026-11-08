import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "StrataFlow | Trustless Milestone Escrows on Stellar",
  description:
    "Programmable milestone escrows, arbitration hooks, and instant settlements on Stellar and Soroban.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-brand-border py-6 text-center text-xs text-neutral-500">
          StrataFlow Protocol © 2026. Built natively for Stellar & Soroban.
        </footer>
      </body>
    </html>
  );
}
