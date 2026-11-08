import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { WalletProvider } from '../context/WalletContext';
import { ToastProvider } from '../context/ToastContext';
import { NetworkBanner } from '../components/NetworkBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'StrataFlow | Trustless Milestone Escrows on Stellar',
  description:
    'Programmable milestone escrows, arbitration hooks, and instant settlements on Stellar and Soroban.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <WalletProvider>
          <ToastProvider>
            <NetworkBanner />
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <footer className="border-t border-brand-border py-6 text-center text-xs text-neutral-500">
              StrataFlow Protocol &copy; 2026. Built natively for Stellar &amp; Soroban.
            </footer>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
