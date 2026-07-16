import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { LogIn, Eye, EyeOff, AlertCircle, Globe2 } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/compare';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (field) => (evt) => {
    setForm((f) => ({ ...f, [field]: evt.target.value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    setApiError('');
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setApiError('');
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8 lg:py-5">
      <div className="w-full max-w-md animate-fade-up">

        <div className="glass rounded-2xl p-6 sm:p-7 lg:p-6">

          <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
            <div className="w-11 h-11 rounded-2xl bg-brand-900/60 flex items-center justify-center mb-1">
              <Globe2 size={24} className="text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-surface-600">Sign in to your MetroScope Flow account</p>
          </div>

          {apiError && (
            <div className="flex items-start gap-2 mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {apiError}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="text-sm font-medium text-surface-400">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className={`input-base ${errors.email ? 'error' : ''}`}
              />
              {errors.email && (
                <p id="login-email-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} aria-hidden="true" /> {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="text-sm font-medium text-surface-400">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'login-pw-error' : undefined}
                  className={`input-base pr-10 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-600 hover:text-surface-400 transition-colors p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
              {errors.password && (
                <p id="login-pw-error" role="alert" className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} aria-hidden="true" /> {errors.password}
                </p>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-1"
            >
              {loading ? (
                <span className="animate-pulse-soft">Signing in…</span>
              ) : (
                <>
                  <LogIn size={17} /> Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
