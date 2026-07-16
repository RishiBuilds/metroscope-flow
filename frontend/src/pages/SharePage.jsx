import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Globe2, AlertCircle, Loader2, BarChart3 } from '../components/icons.jsx';
import { getSharedComparison } from '../api/comparisons.js';
import { compareCities } from '../api/cities.js';
import { fadeUp, staggerContainer } from '../lib/motion.js';

const CITY_COLORS = [
  'oklch(0.67 0.22 260)',
  'oklch(0.75 0.20 70)',
  'oklch(0.65 0.22 150)',
  'oklch(0.65 0.20 30)',
];

const METRICS = [
  { label: 'Monthly Rent',      key: 'avg_monthly_rent_usd',    format: (v) => `$${v?.toLocaleString()}` },
  { label: 'Avg Salary/yr',     key: 'avg_salary_usd',          format: (v) => `$${v?.toLocaleString()}` },
  { label: 'Internet/mo',       key: 'internet_cost_usd',       format: (v) => `$${v}` },
  { label: 'Food Cost Index',   key: 'food_cost_index',         format: (v) => v },
  { label: 'Transport Index',   key: 'transport_cost_index',    format: (v) => v },
  { label: 'Quality of Life',   key: 'quality_of_life_score',   format: (v) => `${v}/100` },
  { label: 'Healthcare',        key: 'healthcare_score',        format: (v) => `${v}/100` },
  { label: 'Safety',            key: 'safety_score',            format: (v) => `${v}/100` },
  { label: 'Pollution',         key: 'pollution_score',         format: (v) => `${v}/100 ↓` },
];

export default function SharePage() {
  const { token } = useParams();
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [meta, setMeta]         = useState(null);    
  const [cities, setCities]     = useState([]);      

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getSharedComparison(token)
      .then(async (res) => {
        const comparison = res.data.data;
        setMeta({ name: comparison.name, notes: comparison.notes });
        const ids = comparison.cityIds.map((c) => (typeof c === 'object' ? c._id : c));
        const cityRes = await compareCities(ids);
        setCities(cityRes.data.data ?? []);
      })
      .catch(() => setError('This shared comparison could not be found. The link may have expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-brand-400 animate-spin" />
          <p className="text-surface-400 text-sm animate-pulse-soft">Loading shared comparison…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <AlertCircle size={36} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Comparison not found</h1>
          <p className="text-surface-600 text-sm mb-6">{error}</p>
          <Link to="/compare" className="btn-primary text-sm">Start a new comparison</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 sm:px-6 py-8 max-w-4xl mx-auto w-full">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold uppercase tracking-widest mb-2">
          <Globe2 size={14} /> MetroScope Flow · Shared Comparison
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {meta?.name || cities.map((c) => c.city).join(' vs ')}
        </h1>
        {meta?.notes && (
          <p className="mt-3 text-surface-500 text-sm leading-relaxed max-w-2xl italic">
            "{meta.notes}"
          </p>
        )}
        <div className="flex items-center gap-3 mt-4">
          <Link to={`/compare?ids=${cities.map((c) => c._id).join(',')}`} className="btn-primary text-sm py-2 px-4">
            <BarChart3 size={15} /> Open Live Comparison
          </Link>
          <Link to="/" className="btn-ghost text-sm border border-surface-700/60">
            ← MetroScope Flow
          </Link>
        </div>
      </motion.div>

      <motion.section
        className="glass rounded-2xl overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700/40">
                <th className="text-left px-5 py-4 text-surface-600 font-medium w-40">Metric</th>
                {cities.map((c, i) => (
                  <th key={c._id} className="px-4 py-4 text-center font-semibold" style={{ color: CITY_COLORS[i % CITY_COLORS.length] }}>
                    {c.city}<br />
                    <span className="text-xs font-normal text-surface-600">{c.country}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
              {METRICS.map(({ label, key, format }, ri) => (
                <motion.tr
                  key={key}
                  className={ri % 2 === 0 ? 'bg-surface-900/20' : ''}
                  variants={fadeUp}
                >
                  <td className="px-5 py-3 text-surface-400 font-medium whitespace-nowrap">{label}</td>
                  {cities.map((c) => (
                    <td key={c._id} className="px-4 py-3 text-center font-mono">
                      {format(c[key])}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.section>

      <p className="text-xs text-surface-700 mt-6 text-center">
        Data shown is educational/illustrative. Shared via MetroScope Flow.
      </p>
    </main>
  );
}
