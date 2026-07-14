import { Link } from 'react-router';
import { MapPin, ArrowLeft } from '../components/icons.jsx';

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="animate-fade-up flex flex-col items-center gap-6 max-w-sm">
        <div className="relative">
          <span className="text-8xl font-black tracking-tighter gradient-text select-none">
            404
          </span>
          <div className="absolute -right-4 -top-2 w-9 h-9 rounded-full bg-brand-900/60 flex items-center justify-center">
            <MapPin size={18} className="text-brand-400" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-2">Page not found</h1>
          <p className="text-sm text-surface-600 leading-relaxed">
            This city isn't on the map. The page you're looking for doesn't exist or has moved.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/" className="btn-primary text-sm">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <Link to="/compare" className="btn-ghost border border-surface-700/60 text-sm">
            Start comparing
          </Link>
        </div>
      </div>
    </main>
  );
}
