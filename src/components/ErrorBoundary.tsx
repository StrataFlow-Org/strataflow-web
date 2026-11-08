'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[StrataFlow Web ErrorBoundary]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Application Exception</h2>
            <p className="text-xs text-slate-400 mt-2">
              An unexpected error occurred while rendering this interface. Please try reloading.
            </p>
            {this.state.error?.message && (
              <pre className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Component</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

