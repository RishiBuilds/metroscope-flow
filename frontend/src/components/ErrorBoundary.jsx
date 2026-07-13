import { Component } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, RefreshCw } from './icons.jsx';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="glass rounded-2xl p-8 max-w-md w-full animate-fade-up flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-1">Something went wrong</h1>
            <p className="text-sm text-surface-600 leading-relaxed">
              An unexpected error occurred. Refreshing the page usually fixes it.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              <RefreshCw size={15} /> Refresh page
            </button>
            <Link to="/" className="btn-ghost border border-surface-700/60 text-sm">
              Go home
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
