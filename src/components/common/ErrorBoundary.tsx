import React, { Component, ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI rendering failure caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F3E6D0] text-[#3B2A1A] flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#FAF4E8] border border-[#D8C5A8] rounded-2xl p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center border border-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C99A2E] font-bold">SYSTEM RECOVERY</span>
              <h2 className="text-2xl font-bold font-serif text-[#3B2A1A] mt-1">Something Went Wrong</h2>
              <p className="text-xs text-[#6B5842] mt-2 leading-relaxed">
                An unexpected interface error occurred. You can return to the main storefront safely.
              </p>
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="w-full py-3.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
