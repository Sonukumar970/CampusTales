import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a runtime error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-rose-500/20 text-center space-y-5 shadow-2xl shadow-rose-500/5">
            <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Oops! Something went off-syllabus
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected hiccup occurred while rendering this page. Don't worry, your stories and memories are completely safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-pill hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Back to Campus</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
