/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 * Displays fallback UI and logs error details
 */

'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: Send to error tracking service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="card-premium max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-400" size={48} />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>

            <p className="text-gray-400 mb-6">
              We apologize for the inconvenience. An unexpected error occurred while loading this
              page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg text-left">
                <p className="text-red-400 font-mono text-sm break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-platinum transition-all duration-300 hover-lift flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Try Again
              </button>

              <Link
                href="/"
                className="px-6 py-3 glass border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Go Home
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

