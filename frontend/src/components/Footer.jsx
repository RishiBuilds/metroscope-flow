import { Globe2 } from './icons.jsx';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-700/40 bg-surface-950/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2 text-surface-600 text-sm">
          <Globe2 size={16} className="text-brand-500" />
          <span className="font-semibold gradient-text">MetroScope Flow</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-surface-600">
          <Link to="/" className="hover:text-surface-400 transition-colors">Home</Link>
          <Link to="/compare" className="hover:text-surface-400 transition-colors">Compare</Link>
        </div>
      </div>
    </footer>
  );
}
