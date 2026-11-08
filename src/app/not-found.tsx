import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center backdrop-blur-md">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">404 - Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">
          The requested escrow agreement or page does not exist on this network.
        </p>

        <div className="mt-6">
          <Link
            href="/agreements"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Agreements</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
