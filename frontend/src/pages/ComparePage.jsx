import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, LogIn, AlertCircle, Trophy, TableProperties, ChartNoAxesCombined, Sparkles, WalletCards, HeartPulse, Leaf, ShieldCheck } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { compareCities } from '../api/cities.js';
import CityPicker from '../components/CityPicker.jsx';
import SaveModal from '../components/SaveModal.jsx';
import Skeleton from '../components/Skeleton.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import {
  CostOfLivingChart,
  AffordabilityChart,
  FoodTransportChart,
  QualityRadarChart,
  PollutionChart,
  CITY_COLORS,
} from '../components/ComparisonCharts.jsx';
import { fadeUp, staggerContainer, SPRING_POP, EASE, T_DEFAULT } from '../lib/motion.js';

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0);
  const startRef  = useRef(null);
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
    if (target === 0) { setValue(0); return; }
    let raf;
    startRef.current = null;

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * targetRef.current));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const SUMMARY_METRICS = [
  { label: 'Monthly Rent',        key: 'avg_monthly_rent_usd',     format: (v) => `$${v?.toLocaleString()}` },
  { label: 'Internet ($/mo)',     key: 'internet_cost_usd',        format: (v) => `$${v}` },
  { label: 'Avg Salary ($/yr)',   key: 'avg_salary_usd',           format: (v) => `$${v?.toLocaleString()}` },
  { label: 'Food Cost Index',     key: 'food_cost_index',          format: (v) => v },
  { label: 'Transport Index',     key: 'transport_cost_index',     format: (v) => v },
  { label: 'Quality of Life',     key: 'quality_of_life_score',    format: (v) => `${v}/100` },
  { label: 'Healthcare',          key: 'healthcare_score',         format: (v) => `${v}/100` },
  { label: 'Safety',              key: 'safety_score',             format: (v) => `${v}/100` },
  { label: 'Pollution (Lower is better)', key: 'pollution_score', format: (v) => `${v}/100` },
];

const METRIC_GROUPS = [
  { title: 'Affordability', note: 'Lower costs and higher salary are better.', metrics: [
    { label: 'Monthly rent', key: 'avg_monthly_rent_usd', low: true, format: (v) => '$' + v?.toLocaleString() },
    { label: 'Internet / month', key: 'internet_cost_usd', low: true, format: (v) => '$' + v },
    { label: 'Average salary / year', key: 'avg_salary_usd', format: (v) => '$' + v?.toLocaleString() },
  ] },
  { title: 'Cost of Living', note: 'Indices use NYC = 100; lower is more affordable.', metrics: [
    { label: 'Food cost index', key: 'food_cost_index', low: true, format: (v) => v },
    { label: 'Transport index', key: 'transport_cost_index', low: true, format: (v) => v },
  ] },
  { title: 'Quality, Safety & Healthcare', note: 'Higher scores are better.', metrics: [
    { label: 'Quality of life', key: 'quality_of_life_score', format: (v) => v + '/100' },
    { label: 'Healthcare', key: 'healthcare_score', format: (v) => v + '/100' },
    { label: 'Safety', key: 'safety_score', format: (v) => v + '/100' },
  ] },
  { title: 'Environment', note: 'Lower pollution is better.', metrics: [{ label: 'Pollution score', key: 'pollution_score', low: true, format: (v) => v + '/100' }] },
];

const DECISION_GROUPS = [
  { title: 'Affordability', icon: WalletCards, metrics: [
    { label: 'Monthly rent', key: 'avg_monthly_rent_usd', low: true },
    { label: 'Internet / month', key: 'internet_cost_usd', low: true },
    { label: 'Average salary / year', key: 'avg_salary_usd' },
    { label: 'Food cost index', key: 'food_cost_index', low: true },
    { label: 'Transport index', key: 'transport_cost_index', low: true },
  ] },
  { title: 'Safety', icon: ShieldCheck, metrics: [
    { label: 'Safety', key: 'safety_score' }
  ] },
  { title: 'Quality of Life', icon: Sparkles, metrics: [
    { label: 'Quality of life', key: 'quality_of_life_score' }
  ] },
  { title: 'Healthcare', icon: HeartPulse, metrics: [
    { label: 'Healthcare', key: 'healthcare_score' }
  ] },
  { title: 'Environment', icon: Leaf, metrics: [
    { label: 'Pollution score', key: 'pollution_score', low: true }
  ] },
];

function scoreMetric(cities, metric) {
  const values = cities.map((city) => Number(city[metric.key]) || 0);
  const best = metric.low ? Math.min(...values) : Math.max(...values);
  const worst = metric.low ? Math.max(...values) : Math.min(...values);
  if (best === worst) return cities.map((city) => ({ city, score: 100 }));

  return cities.map((city, index) => ({
    city,
    score: Math.round(metric.low
      ? ((worst - values[index]) / (worst - best)) * 100
      : ((values[index] - worst) / (best - worst)) * 100),
  }));
}

function makeDecision(cities, weights) {
  const groupScores = DECISION_GROUPS.map((group) => {
    const scoresByCity = cities.map((city) => ({ city, score: 0 }));
    group.metrics.forEach((metric) => {
      scoreMetric(cities, metric).forEach(({ city, score }, index) => { scoresByCity[index].score += score / group.metrics.length; });
    });
    scoresByCity.forEach((item) => { item.score = Math.round(item.score); });
    const high = Math.max(...scoresByCity.map((item) => item.score));
    return { ...group, weight: weights[group.title.toLowerCase()], scoresByCity, high };
  });

  const totals = cities.map((city) => ({
    city,
    score: Math.round(groupScores.reduce((total, group) => total + group.scoresByCity.find((item) => item.city._id === city._id).score * group.weight, 0)),
  }));
  const recommended = totals.reduce((best, current) => current.score > best.score ? current : best);
  const runnerUp = [...totals].sort((a, b) => b.score - a.score)[1];
  const groups = groupScores.map((group) => {
    const winners = group.scoresByCity
      .filter((item) => item.score === group.high)
      .map((item) => item.city);
    return { ...group, winners };
  });
  return { groups, totals, recommended, lead: Math.max(0, recommended.score - runnerUp.score) };
}

function AnimatedScoreRing({ score }) {
  const counted = useCountUp(score, 700);
  return (
    <div
      className="decision-ring shrink-0 size-28 flex flex-col items-center justify-center text-center"
      style={{ '--score': `${counted * 3.6}deg` }}
      aria-label={`Overall decision score ${score} out of 100`}
    >
      <span className="text-3xl font-extrabold text-brand-200">{counted}</span>
      <span className="text-[10px] uppercase tracking-wider text-surface-500">Decision score</span>
    </div>
  );
}

function DecisionSummary({ cities, weights, onWeightChange, decision }) {
  const { recommended } = decision;
  const winningGroups = decision.groups.filter((group) => group.winners.some((city) => city._id === recommended.city._id));
  const leadText = decision.lead === 0
    ? 'The leading cities are effectively tied with the current default priorities.'
    : `${recommended.city.city} leads the next option by ${decision.lead} points using your current priorities.`;

  return (
    <motion.section
      className="mb-8"
      aria-labelledby="decision-summary-heading"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="decision-summary relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-brand-300"><Sparkles size={14} /> Recommended destination</p>
            <h2 id="decision-summary-heading" className="text-2xl font-extrabold mt-1">{recommended.city.city}</h2>
            <p className="text-sm text-surface-500 mt-2 max-w-xl">{leadText} It performs best across {winningGroups.map((group) => group.title.toLowerCase()).join(' and ') || 'the selected decision drivers'}.</p>
          </div>
          <AnimatedScoreRing score={recommended.score} />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {decision.groups.map((group) => {
          const Icon = group.icon;
          const winnerNames = group.winners.map((city) => city.city).join(' · ');
          return (
            <motion.div key={group.title} className="glow-card p-4 rounded-xl" variants={fadeUp}>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-surface-500"><Icon size={14} className="text-brand-300" /> {group.title} winner</div>
              <p className="font-bold text-base mt-1 truncate" title={winnerNames}>{winnerNames}</p>
              <p className="text-[10px] text-surface-600 mt-1">{group.metrics.length} metrics · {Math.round(group.weight * 100)}% weight</p>
              <label className="block text-[10px] text-surface-600 mt-3" htmlFor={`weight-${group.title}`}>
                Priority: {Math.round(group.weight * 100)}%
                <input id={`weight-${group.title}`} className="weight-slider mt-2 w-full" type="range" min="0" max="100" value={Math.round(group.weight * 100)} onChange={(event) => onWeightChange(group.title.toLowerCase(), Number(event.target.value) / 100)} />
              </label>
            </motion.div>
          );
        })}
      </motion.div>
      <p className="text-xs text-surface-600 mt-3">Adjust a priority and the others scale proportionally, keeping your total at 100%.</p>
    </motion.section>
  );
}

function WinnerBadge() {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={SPRING_POP}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Trophy size={13} className="inline mr-1 -mt-0.5" aria-label="Best" />
    </motion.span>
  );
}

function CountingCell({ value, format, isNum }) {
  const numeric = isNum ? Number(String(value).replace(/[^0-9.]/g, '')) || 0 : null;
  const counted = useCountUp(numeric || 0, 600);

  if (!isNum) return <>{format(value)}</>;
  const formatted = format(value);
  return <>{formatted.replace(/[\d,]+/, counted.toLocaleString())}</>;
}

function isWinner(city, cities, metric) {
  const target = metric.low ? Math.min(...cities.map((item) => item[metric.key])) : Math.max(...cities.map((item) => item[metric.key]));
  return city[metric.key] === target;
}

function MetricGroup({ group, cities }) {
  return (
    <motion.section
      className="glow-card overflow-hidden rounded-2xl"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="px-5 py-4 border-b border-surface-700/40"><h2 className="font-bold text-base">{group.title}</h2><p className="text-xs text-surface-600 mt-0.5">{group.note}</p></div>
      <div className="hidden sm:block overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-surface-700/40"><th className="text-left px-5 py-3 text-surface-600 font-medium">Metric</th>{cities.map((c, i) => <th key={c._id} className="px-4 py-3 text-center" style={{ color: CITY_COLORS[i] }}>{c.city}</th>)}</tr></thead><tbody>{group.metrics.map((metric, ri) => <tr key={metric.key} className={ri % 2 ? '' : 'bg-surface-900/20'}><td className="px-5 py-3 text-surface-400 font-medium">{metric.label}</td>{cities.map((city) => <td key={city._id} className={'px-4 py-3 text-center font-mono ' + (isWinner(city, cities, metric) ? 'winner' : '')}>{isWinner(city, cities, metric) && <WinnerBadge />}{metric.format(city[metric.key])}</td>)}</tr>)}</tbody></table></div>
      <div className="sm:hidden divide-y divide-surface-700/35">{group.metrics.map((metric) => <div key={metric.key} className="p-4"><p className="text-xs font-semibold text-surface-500 mb-2">{metric.label}</p><div className="grid grid-cols-2 gap-2">{cities.map((city, i) => <div key={city._id} className={'rounded-lg p-2.5 ' + (isWinner(city, cities, metric) ? 'winner' : 'bg-surface-900/35')}><p className="text-xs truncate" style={{ color: CITY_COLORS[i] }}>{city.city}</p><p className="font-mono text-sm mt-1">{isWinner(city, cities, metric) && <WinnerBadge />}{metric.format(city[metric.key])}</p></div>)}</div></div>)}</div>
    </motion.section>
  );
}

function ChartSection({ title, subtitle, children }) {
  return (
    <motion.section
      className="glow-card rounded-2xl p-5 sm:p-6"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      <div className="mb-4">
        <h2 className="font-bold text-base sm:text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-surface-600 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

export default function ComparePage() {
  const { user } = useAuth();
  const { currency, symbols, formatCurrency } = useCurrency();
  const [searchParams] = useSearchParams();

  const [selected, setSelected]     = useState([]);
  const [cityData, setCityData]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showSave, setShowSave]     = useState(false);
  const [view, setView]             = useState('charts');
  const [weights, setWeights]       = useState(() => {
    const saved = localStorage.getItem('metroscope_weights');
    return saved ? JSON.parse(saved) : { affordability: 0.25, safety: 0.20, 'quality of life': 0.20, healthcare: 0.20, environment: 0.15 };
  });

  const cityDataIdsRef = useRef('');

  useEffect(() => {
    localStorage.setItem('metroscope_weights', JSON.stringify(weights));
  }, [weights]);

  const normalizeCities = (cities) => cities.map((city) => ({
    ...city,
    quality_of_life_score: Math.min(100, Math.round((Number(city.quality_of_life_score) || 0) / 2.2)),
  }));

  const updateWeight = (changedKey, nextWeight) => {
    setWeights((current) => {
      const otherKeys = Object.keys(current).filter((key) => key !== changedKey);
      const changed = Math.max(0, Math.min(1, nextWeight));
      const remaining = 1 - changed;
      const otherTotal = otherKeys.reduce((total, key) => total + current[key], 0);
      const next = { ...current, [changedKey]: changed };
      
      let sumOfOthers = 0;
      otherKeys.forEach((key, index) => {
        if (index === otherKeys.length - 1) {
          next[key] = Math.max(0, parseFloat((remaining - sumOfOthers).toFixed(4)));
        } else {
          const val = otherTotal 
            ? (current[key] / otherTotal) * remaining 
            : remaining / otherKeys.length;
          next[key] = parseFloat(val.toFixed(4));
          sumOfOthers += next[key];
        }
      });
      return next;
    });
  };

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (!idsParam) return;
    const ids = idsParam.split(',').filter(Boolean);
    if (ids.length < 2) return;

    setLoading(true);
    setError('');
    compareCities(ids)
      .then((res) => {
        const cities = res.data.data ?? [];
        const normalized = normalizeCities(cities);
        setSelected(cities.map(({ _id, city, country }) => ({ _id, city, country })));
        setCityData(normalized);
        cityDataIdsRef.current = normalized.map((c) => c._id).sort().join(',');
      })
      .catch(() => setError('Could not load comparison data. Please try again.'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    if (selected.length < 2) { setCityData([]); return; }
 
    const selectedIds = selected.map((c) => c._id).sort().join(',');
    if (cityDataIdsRef.current === selectedIds) return;

    let cancelled = false;
    setLoading(true);
    setError('');
    compareCities(selected.map((c) => c._id))
      .then((res) => {
        if (!cancelled) {
          const normalized = normalizeCities(res.data.data ?? []);
          setCityData(normalized);
          cityDataIdsRef.current = normalized.map((c) => c._id).sort().join(',');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load comparison data. Please try again.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const summaryMetrics = [
    { label: 'Monthly Rent',        key: 'avg_monthly_rent_usd',     format: (v) => formatCurrency(v) },
    { label: `Internet (${symbols[currency] || '$'}/mo)`,     key: 'internet_cost_usd',        format: (v) => formatCurrency(v) },
    { label: `Avg Salary (${symbols[currency] || '$'}/yr)`,   key: 'avg_salary_usd',           format: (v) => formatCurrency(v) },
    { label: 'Food Cost Index',     key: 'food_cost_index',          format: (v) => v },
    { label: 'Transport Index',     key: 'transport_cost_index',     format: (v) => v },
    { label: 'Quality of Life',     key: 'quality_of_life_score',    format: (v) => `${v}/100` },
    { label: 'Healthcare',          key: 'healthcare_score',         format: (v) => `${v}/100` },
    { label: 'Safety',              key: 'safety_score',             format: (v) => `${v}/100` },
    { label: 'Pollution (Lower is better)', key: 'pollution_score', format: (v) => `${v}/100` },
  ];

  const metricGroups = [
    { title: 'Affordability', note: 'Lower costs and higher salary are better.', metrics: [
      { label: 'Monthly rent', key: 'avg_monthly_rent_usd', low: true, format: (v) => formatCurrency(v) },
      { label: 'Internet / month', key: 'internet_cost_usd', low: true, format: (v) => formatCurrency(v) },
      { label: 'Average salary / year', key: 'avg_salary_usd', format: (v) => formatCurrency(v) },
    ] },
    { title: 'Cost of Living', note: 'Indices use NYC = 100; lower is more affordable.', metrics: [
      { label: 'Food cost index', key: 'food_cost_index', low: true, format: (v) => v },
      { label: 'Transport index', key: 'transport_cost_index', low: true, format: (v) => v },
    ] },
    { title: 'Quality, Safety & Healthcare', note: 'Higher scores are better.', metrics: [
      { label: 'Quality of life', key: 'quality_of_life_score', format: (v) => v + '/100' },
      { label: 'Healthcare', key: 'healthcare_score', format: (v) => v + '/100' },
      { label: 'Safety', key: 'safety_score', format: (v) => v + '/100' },
    ] },
    { title: 'Environment', note: 'Lower pollution is better.', metrics: [{ label: 'Pollution score', key: 'pollution_score', low: true, format: (v) => v + '/100' }] },
  ];

  const decision = cityData.length >= 2 ? makeDecision(cityData, weights) : null;
  const defaultSaveName = selected.map((c) => c.city).join(' vs ');

  return (
    <main className="flex-1 px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">
      <ScrollProgress />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
          City <span className="gradient-text">Comparison</span>
        </h1>
        <p className="text-sm text-surface-600">
          Search and select 2–4 cities to compare across 9 key metrics.
        </p>
      </div>

      <div className="glass rounded-2xl p-5 mb-6">
        <CityPicker selected={selected} onChange={setSelected} />
      </div>

      {loading && (
        <div className="flex flex-col gap-4" aria-live="polite" aria-busy="true">
          <Skeleton className="h-10 w-48 rounded-xl mb-2" />
          <Skeleton.ChartBlock />
          <Skeleton.ChartBlock />
          <Skeleton.ChartBlock />
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && selected.length < 2 && (
        <div className="empty-comparison flex flex-col items-center justify-center py-16 gap-4 text-center text-surface-600">
          <svg viewBox="0 0 320 150" className="w-full max-w-sm" aria-hidden="true"><defs><linearGradient id="scan" x1="0" x2="1"><stop stopColor="transparent"/><stop offset=".5" stopColor="currentColor"/><stop offset="1" stopColor="transparent"/></linearGradient></defs><path d="M20 120h280M42 120V84h22v36m12 0V60h30v60m14 0V76h24v44m16 0V42h36v78m14 0V68h25v52m14 0V90h20v30" fill="none" stroke="currentColor" strokeWidth="2" opacity=".65"/><path d="M18 25h284M18 50h284M18 75h284" stroke="currentColor" strokeDasharray="3 7" opacity=".2"/><path className="empty-scan" d="M0 0v150" stroke="url(#scan)" strokeWidth="18"/></svg>
          <p className="text-sm max-w-xs">
            Search for cities above and add at least <strong className="text-surface-400">2</strong> to see a detailed side-by-side comparison.
          </p>
        </div>
      )}

      {!loading && !error && cityData.length >= 2 && (
        <>
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 glass rounded-xl px-4 py-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className="text-sm text-surface-600">
              Comparing{' '}
              {cityData.map((c, i) => (
                <span key={c._id}>
                  <strong style={{ color: CITY_COLORS[i % CITY_COLORS.length] }}>{c.city}</strong>
                  {decision && decision.recommended.city._id === c._id && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, ...SPRING_POP }}
                      className="inline-flex items-center gap-0.5 ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30"
                    >
                      <Trophy size={9} /> Best Match
                    </motion.span>
                  )}
                  {i < cityData.length - 1 ? ' vs ' : ''}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <motion.button
                  onClick={() => setShowSave(true)}
                  className="btn-primary text-sm py-2 px-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Bookmark size={15} /> Save
                </motion.button>
              ) : (
                <Link to="/login" className="btn-ghost text-sm border border-surface-700/60">
                  <LogIn size={15} /> Log in to save
                </Link>
              )}
            </div>
          </motion.div>

          {decision && <DecisionSummary cities={cityData} weights={weights} onWeightChange={updateWeight} decision={decision} />}

          <div className="flex items-center justify-between gap-3 mb-4">
            <div><h2 className="font-bold text-lg">Decision drivers</h2><p className="text-xs text-surface-600">Use the detailed data below to validate what matters most to you. Trophies mark the best metric result.</p></div>
            <div className="inline-flex rounded-lg border border-surface-700/60 p-1" role="group" aria-label="Comparison view">
              <button onClick={() => setView('charts')} className={'btn-ghost min-h-0 py-1.5 px-2.5 text-xs ' + (view === 'charts' ? 'bg-surface-700/70 text-white' : '')} aria-pressed={view === 'charts'}><ChartNoAxesCombined size={14}/> Charts</button>
              <button onClick={() => setView('table')} className={'btn-ghost min-h-0 py-1.5 px-2.5 text-xs ' + (view === 'table' ? 'bg-surface-700/70 text-white' : '')} aria-pressed={view === 'table'}><TableProperties size={14}/> Table</button>
            </div>
          </div>

          {view === 'table' && (
            <motion.div
              className="flex flex-col gap-4 mb-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {metricGroups.map((group) => <MetricGroup key={group.title} group={group} cities={cityData} />)}
            </motion.div>
          )}

          {view === 'charts' && (
            <>
              <motion.section
                className="glass rounded-2xl overflow-hidden mb-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.08 }}
              >
                <div className="px-5 py-4 border-b border-surface-700/40">
                  <h2 className="font-bold text-base sm:text-lg">At a Glance</h2>
                  <p className="text-xs text-surface-600 mt-0.5">All key metrics in one view</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-700/40">
                        <th className="text-left px-5 py-3 text-surface-600 font-medium w-40 shrink-0">Metric</th>
                        {cityData.map((c, i) => (
                          <th key={c._id} className="px-4 py-3 text-center font-semibold" style={{ color: CITY_COLORS[i % CITY_COLORS.length] }}>
                            {c.city}<br />
                            <span className="text-xs font-normal text-surface-600">{c.country}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                       {summaryMetrics.map(({ label, key, format }, ri) => (
                        <tr key={key} className={ri % 2 === 0 ? 'bg-surface-900/20' : ''}>
                          <td className="px-5 py-2.5 text-surface-400 font-medium whitespace-nowrap">{label}</td>
                          {cityData.map((c) => (
                            <td key={c._id} className="px-4 py-2.5 text-center font-mono text-sm">
                              {format(c[key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>

              <div className="flex flex-col gap-5">
                <ChartSection title="Cost of Living Index" subtitle="Combined food + transport index (NYC = 100 baseline)">
                  <CostOfLivingChart cities={cityData} />
                </ChartSection>
                <ChartSection title="Affordability" subtitle="Monthly rent, internet cost, and average annual salary in USD">
                  <AffordabilityChart cities={cityData} />
                </ChartSection>
                <ChartSection title="Food & Transport Cost Index" subtitle="0–100+ scale, NYC = 100 baseline — higher means more expensive">
                  <FoodTransportChart cities={cityData} />
                </ChartSection>
                <ChartSection title="Quality of Life, Healthcare & Safety" subtitle="0–100 scale — higher is better">
                  <QualityRadarChart cities={cityData} />
                </ChartSection>
                <ChartSection title="Pollution / Environment Score" subtitle="0–100 scale — lower is better (greener = cleaner city)">
                  <PollutionChart cities={cityData} />
                  <p className="text-xs text-surface-600 mt-2 text-center">
                    Lower score = cleaner environment. NYC baseline ~ 50.
                  </p>
                </ChartSection>
              </div>
            </>
          )}
        </>
      )}

      <AnimatePresence>
        {showSave && (
          <SaveModal
            cityIds={selected.map((c) => c._id)}
            defaultName={defaultSaveName}
            onClose={() => setShowSave(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
