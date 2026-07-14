import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, LogOut, Calendar, Bookmark, ArrowRight, Loader2 } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { listComparisons } from '../api/comparisons.js';
import { listVisaResults } from '../api/tools.js';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-brand-900/60 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-brand-400" />
      </div>
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-xs text-surface-600 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [savedCount, setSavedCount] = useState(null);
  const [countLoading, setCountLoading] = useState(true);
  const [visaResults, setVisaResults] = useState([]);

  useEffect(() => {
    listComparisons()
      .then((res) => setSavedCount(res.data.meta?.total ?? 0))
      .catch(() => setSavedCount(0))
      .finally(() => setCountLoading(false));
  }, []);
  useEffect(() => { listVisaResults().then((res) => setVisaResults(res.data.data || [])).catch(() => setVisaResults([])); }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '—';

  return (
    <main className="flex-1 px-4 sm:px-6 py-10 max-w-xl mx-auto w-full">

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
        Your <span className="gradient-text">Profile</span>
      </h1>

      <div className="glass rounded-2xl p-6 sm:p-8 mb-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-900/60 flex items-center justify-center shrink-0">
            <User size={28} className="text-brand-400" />
          </div>
          <div>
            <h2 id="profile-name" className="text-xl font-bold leading-tight">{user?.name}</h2>
            <p id="profile-email" className="text-sm text-surface-600 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Calendar}
            label="Member since"
            value={joinedDate}
          />
          <StatCard
            icon={Bookmark}
            label="Saved comparisons"
            value={countLoading
              ? <Loader2 size={16} className="animate-spin text-brand-400" />
              : savedCount
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between"><h2 className="font-bold">Past Visa Predictions</h2><Link to="/visa-predictor" className="text-sm text-brand-400">New prediction</Link></div>
          {visaResults.length ? <div className="mt-3 space-y-2">{visaResults.slice(0, 3).map((entry) => <div key={entry._id} className="flex justify-between text-sm border-t border-surface-700/50 pt-2"><span>{entry.inputs?.destination_country}</span><span className="text-brand-400 font-bold">{entry.result?.score}/100</span></div>)}</div> : <p className="text-sm text-surface-600 mt-2">No saved predictions yet.</p>}
          <Link to="/checklist" className="inline-block mt-4 text-sm text-brand-400">View active relocation checklist →</Link>
        </div>
        <Link
          to="/saved"
          id="profile-saved-link"
          className="btn-primary w-full justify-between py-3 px-5"
        >
          <span className="flex items-center gap-2">
            <Bookmark size={16} />
            View saved comparisons
          </span>
          <ArrowRight size={16} />
        </Link>

        <button
          id="profile-logout"
          onClick={handleLogout}
          className="btn-ghost w-full justify-center border border-surface-700/60 text-sm py-3"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </main>
  );
}
