import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2, Globe2 } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupPage() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)  score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const pwStrengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const pwStrengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'][pwStrength];

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
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
      await signup({ name: form.name.trim(), email: form.email, password: form.password });
      await login({ email: form.email, password: form.password });
      navigate('/compare', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error?.message || 'Signup failed. Please try again.');
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
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          </div>

          {apiError && (
            <div className="flex items-start gap-2 mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {apiError}
            </div>
          )}

          <form id="signup-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="signup-name" className="text-sm font-medium text-surface-400">
                  Full name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange('name')}
                  className={`input-base ${errors.name ? 'error' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="signup-email" className="text-sm font-medium text-surface-400">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={`input-base ${errors.email ? 'error' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="signup-password" className="text-sm font-medium text-surface-400">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange('password')}
                  className={`input-base pr-10 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-600 hover:text-surface-400 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {form.password && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i <= pwStrength ? pwStrengthColor : 'bg-surface-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-surface-600 w-10 text-right">{pwStrengthLabel}</span>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="signup-confirm" className="text-sm font-medium text-surface-400">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange('confirm')}
                  className={`input-base pr-10 ${errors.confirm ? 'error' : ''}`}
                />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.confirm && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.confirm}
                </p>
              )}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-1"
            >
              {loading ? (
                <span className="animate-pulse-soft">Creating account…</span>
              ) : (
                <>
                  <UserPlus size={17} /> Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-600">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
