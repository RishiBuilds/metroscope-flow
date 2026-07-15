import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from './icons.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3" role="status">
        <Loader2 size={28} className="text-brand-400 animate-spin" />
        <span className="animate-pulse-soft text-brand-400 text-lg font-medium">
          Checking session…
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
