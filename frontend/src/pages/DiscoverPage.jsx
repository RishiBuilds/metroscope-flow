import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import {
  Sparkles, Compass, ArrowRight, ArrowLeft, BarChart3,
  WalletCards, ShieldCheck, HeartPulse, Leaf, Globe2,
  Loader2, AlertCircle, Trophy, MapPin,
} from '../components/icons.jsx';
import { discoverCities } from '../api/discover.js';

const EASE = [0.22, 0.61, 0.36, 1];

const STEPS = [
  {
    id: 'budget',
    question: 'What\'s your monthly housing budget?',
    subtitle: 'This helps us filter cities to your realistic range.',
    icon: WalletCards,
    options: [
      { value: 'low',    label: 'Under $1,000',    desc: 'Budget-conscious, emerging cities' },
      { value: 'medium', label: '$1,000 – $2,000',  desc: 'Mid-range global cities' },
      { value: 'high',   label: '$2,000+',          desc: 'Premium or tier-1 cities' },
    ],
  },
  {
    id: 'climate',
    question: 'What climate feels like home?',
    subtitle: 'Your ideal seasonal weather and outdoor environment.',
    icon: Globe2,
    options: [
      { value: 'warm',     label: '☀️ Warm & Sunny',    desc: 'Tropical or Mediterranean' },
      { value: 'moderate', label: '🌤 Moderate',         desc: 'Four seasons, mild winters' },
      { value: 'cold',     label: '❄️ Cool & Crisp',     desc: 'Distinct winters, fresh air' },
    ],
  },
  {
    id: 'pace',
    question: 'What lifestyle pace suits you?',
    subtitle: 'Think about your day-to-day energy and social scene.',
    icon: Compass,
    options: [
      { value: 'fast',     label: '⚡ Fast & Vibrant',   desc: 'Buzzing, 24/7 urban energy' },
      { value: 'balanced', label: '⚖️ Balanced',         desc: 'Work hard, play hard' },
      { value: 'relaxed',  label: '🌿 Relaxed & Easy',   desc: 'Slower pace, quality of life' },
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    subtitle: 'Pick your single most important factor in a new city.',
    icon: Trophy,
    options: [
      { value: 'affordability', label: '💰 Affordability',   desc: 'Low cost of living', icon: WalletCards },
      { value: 'safety',        label: '🛡 Safety',           desc: 'Low crime, secure', icon: ShieldCheck },
      { value: 'quality',       label: '✨ Quality of Life',  desc: 'Overall liveability', icon: Sparkles },
      { value: 'healthcare',    label: '❤️ Healthcare',       desc: 'Access and quality', icon: HeartPulse },
      { value: 'nature',        label: '🌿 Clean Environment', desc: 'Low pollution', icon: Leaf },
    ],
  },
  {
    id: 'work',
    question: 'How do you work?',
    subtitle: 'Your work setup influences which city attributes matter.',
    icon: BarChart3,
    options: [
      { value: 'remote',   label: '🏡 Fully Remote',    desc: 'Work from anywhere' },
      { value: 'office',   label: '🏢 In-Office',       desc: 'Near business districts' },
      { value: 'flexible', label: '🔄 Hybrid / Flex',   desc: 'Mix of both' },
    ],
  },
];

function QuizCard({ step, answer, onSelect }) {
  const Icon = step.icon;
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">{step.question}</h2>
          <p className="text-sm text-surface-500">{step.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-3">
        {step.options.map((opt) => {
          const selected = answer === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 glow-card-interactive ${
                selected
                  ? 'bg-brand-500/20 border-brand-500/80 text-white shadow-[0_0_20px_oklch(0.55_0.24_260_/_0.2)]'
                  : 'bg-surface-900/40 border-surface-700/40 hover:border-surface-600/60 hover:bg-surface-800/60 text-surface-300'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex-1">
                <div className="font-semibold text-sm">{opt.label}</div>
                <div className="text-xs text-surface-500 mt-0.5">{opt.desc}</div>
              </div>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-sm"
                >
                  <svg viewBox="0 0 10 8" className="w-3 h-3 text-white fill-current">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function MatchCard({ match, rank, cityIds }) {
  const rankColors = ['oklch(0.67 0.22 260)', 'oklch(0.75 0.20 70)', 'oklch(0.65 0.22 150)'];
  const rankLabels = ['🥇 Best Match', '🥈 Runner-up', '🥉 Third'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.4, ease: EASE }}
      className="glow-card rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: rankColors[rank] }}>
            {rankLabels[rank]}
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">{match.city}</h3>
          <p className="text-sm text-surface-500 flex items-center gap-1 mt-0.5">
            <MapPin size={13} /> {match.country}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl font-black tabular-nums" style={{ color: rankColors[rank] }}>
            {match.score}
          </div>
          <div className="text-xs text-surface-600">match score</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Rent/mo',     value: `$${match.metrics.avg_monthly_rent_usd?.toLocaleString()}` },
          { label: 'Safety',      value: `${match.metrics.safety_score}/100` },
          { label: 'Quality',     value: `${match.metrics.quality_of_life_score}/100` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface-900/50 rounded-xl px-3 py-2 text-center border border-surface-700/30">
            <div className="text-xs text-surface-500">{label}</div>
            <div className="text-sm font-bold mt-0.5">{value}</div>
          </div>
        ))}
      </div>

      {match.highlights?.length > 0 && (
        <ul className="text-xs text-surface-400 flex flex-col gap-1">
          {match.highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="text-brand-400 font-bold">→</span> {h}
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`/compare?ids=${match._id}`}
        className="btn-primary text-xs py-2.5 rounded-xl justify-center shadow-md"
      >
        <BarChart3 size={14} /> Open in Compare
      </Link>
    </motion.div>
  );
}

export default function DiscoverPage() {
  const [stepIndex, setStepIndex]   = useState(0);
  const [answers, setAnswers]       = useState({});
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [results, setResults]       = useState(null);

  const currentStep = STEPS[stepIndex];
  const currentAnswer = answers[currentStep?.id];
  const progress = ((stepIndex) / STEPS.length) * 100;
  const isLast = stepIndex === STEPS.length - 1;

  function selectAnswer(value) {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));
  }

  async function handleNext() {
    if (!currentAnswer) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await discoverCities(answers);
      setResults(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function handleReset() {
    setAnswers({});
    setStepIndex(0);
    setResults(null);
    setError('');
  }

  return (
    <main className="flex-1 px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles size={12} /> Find Your City
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Discover Your Perfect City
        </h1>
        <p className="text-surface-500 text-sm mt-2 max-w-lg mx-auto">
          Answer 5 quick questions and we'll match you with the best cities for your lifestyle.
        </p>
      </motion.div>

      {!results ? (
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-surface-600 mb-2">
              <span>Question {stepIndex + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress + (100 / STEPS.length)}%` }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <QuizCard
              key={currentStep.id}
              step={currentStep}
              answer={currentAnswer}
              onSelect={selectAnswer}
            />
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 gap-3">
            {stepIndex > 0 ? (
              <motion.button
                onClick={handleBack}
                className="btn-ghost text-sm border border-surface-700/60 py-2 px-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={15} /> Back
              </motion.button>
            ) : <div />}

            <motion.button
              onClick={handleNext}
              disabled={!currentAnswer || loading}
              className="btn-primary text-sm py-2 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={currentAnswer ? { scale: 1.02 } : {}}
              whileTap={currentAnswer ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Finding cities…</>
              ) : isLast ? (
                <><Sparkles size={15} /> Find My City</>
              ) : (
                <>Next <ArrowRight size={15} /></>
              )}
            </motion.button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="text-5xl mb-3"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-extrabold">Your Top Matches</h2>
            <p className="text-surface-500 text-sm mt-1">Based on your preferences, here are your best city fits.</p>
          </div>

          {results.map((match, i) => (
            <MatchCard key={match._id} match={match} rank={i} />
          ))}

          <div className="flex items-center justify-center gap-3 mt-2">
            <button onClick={handleReset} className="btn-ghost text-sm border border-surface-700/60 py-2 px-5">
              ← Retake Quiz
            </button>
            <Link to="/compare" className="btn-primary text-sm py-2 px-5">
              <BarChart3 size={15} /> Compare Cities
            </Link>
          </div>
        </motion.div>
      )}
    </main>
  );
}
