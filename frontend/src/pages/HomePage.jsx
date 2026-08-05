import { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import {
  ArrowRight, BarChart3, ShieldCheck, Compass, ChartRadar, BookmarkPlus,
  AirplaneTakeOff, RoutePath, BookOpen, CheckListIcon2, Database,
  MapPin, ArrowDown, Sparkles, Search, Exchange, Trophy, CheckCircle2, WalletCards,
} from '../components/icons.jsx';
import Reveal from '../components/Reveal.jsx';
import { RevealItem } from '../components/Reveal.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { EASE, T_DEFAULT } from '../lib/motion.js';
import aerial640Png from '../assets/aerial_view-bg-640w.png';
import aerial1280Png from '../assets/aerial_view-bg.png';
import aerial1920Png from '../assets/aerial_view-bg-1920w.png';
import aerial640Webp from '../assets/aerial_view-bg-640w.webp';
import aerial1280Webp from '../assets/aerial_view-bg.webp';
import aerial1920Webp from '../assets/aerial_view-bg-1920w.webp';

const HEADLINE_LINES = [
  { words: ['Know', 'before'], key: 'line1', accent: false },
  { words: ['you', 'move.'],   key: 'line2', accent: false },
];

const HOW_STEPS = [
  { num: '01', icon: Compass,      title: 'Pick cities',     desc: 'Search 500+ cities and build your shortlist in seconds.' },
  { num: '02', icon: ChartRadar,   title: 'Compare metrics', desc: 'See rent, salary, safety, healthcare, and more at a glance.' },
  { num: '03', icon: BookmarkPlus, title: 'Save & decide',   desc: 'Bookmark your best comparisons and revisit when ready.' },
];

const FEATURES = [
  { icon: BarChart3,       title: 'City Comparison',       desc: 'Compare 2–4 cities side by side with real 2026 dataset metrics and winner tags.', to: '/compare',        protected: false },
  { icon: Compass,         title: 'Find Your City Quiz',   desc: 'Answer 5 quick preference questions to discover your best matched global cities.', to: '/discover',       protected: false },
  { icon: WalletCards,     title: 'Priority Customizer',   desc: 'Adjust weights across 5 decision drivers to personalize your city score.',      to: '/compare',        protected: false },
  { icon: AirplaneTakeOff, title: 'Visa Predictor',        desc: 'Get a weighted eligibility score and actionable tips for destination visas.',   to: '/visa-predictor', protected: true },
  { icon: RoutePath,       title: 'Visa Roadmap',          desc: 'Follow a six-phase relocation timeline tailored to your visa application.',       to: '/visa-timeline',  protected: true },
  { icon: BookOpen,        title: 'Culture Guide',         desc: 'Explore cultural etiquette, language tips, and social norms for destinations.', to: '/culture-guide',  protected: true },
  { icon: CheckListIcon2,  title: 'Relocation Checklist',  desc: 'Track your moving tasks with a persistent, country-specific interactive checklist.', to: '/checklist', protected: true },
  { icon: ShieldCheck,     title: 'Saved Comparisons',     desc: 'Save, name, export, and reload your custom city comparisons anytime.',          to: '/saved',          protected: true },
];

const STATS = [
  { value: 500, suffix: '+', label: 'Cities Covered', icon: MapPin },
  { value: 9,   suffix: '',  label: 'Metrics Tracked', icon: ChartRadar },
  { value: 100, suffix: '%', label: 'Free to Use', icon: Sparkles },
  { value: 2026, suffix: '', label: 'Dataset Year', icon: Database },
];

const POPULAR_COMPARISONS = [
  { a: 'Tokyo', b: 'Berlin', label: 'Tokyo vs Berlin' },
  { a: 'London', b: 'Austin', label: 'London vs Austin' },
  { a: 'Singapore', b: 'Barcelona', label: 'Singapore vs Barcelona' },
  { a: 'Toronto', b: 'Amsterdam', label: 'Toronto vs Amsterdam' },
  { a: 'Sydney', b: 'Vancouver', label: 'Sydney vs Vancouver' },
  { a: 'Dubai', b: 'Lisbon', label: 'Dubai vs Lisbon' },
];

const SAMPLE_PREVIEWS = [
  {
    pair: 'Tokyo vs Berlin',
    cityA: { name: 'Tokyo', country: 'Japan', score: 88, winner: true, rent: '$1,150/mo', salary: '$48,000/yr', quality: 88, safety: 92, health: 89, pollution: 24 },
    cityB: { name: 'Berlin', country: 'Germany', score: 84, winner: false, rent: '$1,380/mo', salary: '$56,000/yr', quality: 84, safety: 76, health: 85, pollution: 32 },
    summary: 'Tokyo leads in overall safety, lower rent, and healthcare quality, while Berlin offers higher salary potential for tech roles.',
  },
  {
    pair: 'London vs Austin',
    cityA: { name: 'London', country: 'United Kingdom', score: 82, winner: false, rent: '$2,450/mo', salary: '$68,000/yr', quality: 82, safety: 72, health: 84, pollution: 38 },
    cityB: { name: 'Austin', country: 'United States', score: 86, winner: true, rent: '$1,850/mo', salary: '$85,000/yr', quality: 86, safety: 68, health: 79, pollution: 28 },
    summary: 'Austin scores higher on net take-home salary and rent affordability, whereas London leads in public transit and cultural offerings.',
  },
  {
    pair: 'Singapore vs Barcelona',
    cityA: { name: 'Singapore', country: 'Singapore', score: 91, winner: true, rent: '$2,600/mo', salary: '$72,000/yr', quality: 91, safety: 95, health: 91, pollution: 18 },
    cityB: { name: 'Barcelona', country: 'Spain', score: 85, winner: false, rent: '$1,250/mo', salary: '$42,000/yr', quality: 85, safety: 78, health: 88, pollution: 35 },
    summary: 'Singapore dominates in safety, healthcare, and infrastructure score, while Barcelona offers exceptional affordability and Mediterranean lifestyle.',
  },
];

const USE_CASES = [
  { emoji: '🎓', title: 'Students & graduates', desc: 'Compare tuition-adjacent costs and quality of life before choosing where to study or start a career.' },
  { emoji: '💼', title: 'Remote workers', desc: 'Weigh salary potential against rent and lifestyle when picking your next base city.' },
  { emoji: '🌍', title: 'Expats & relocators', desc: 'Use visa tools, culture guides, and checklists alongside hard city data.' },
];

const heroContainerVariants = {
  hidden:  {},
  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.07 } },
};

const heroWordVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const heroBadgeVariants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.15, ease: EASE } },
};

const heroCTAVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, delay: 0.55, ease: EASE } },
};

function useCountUp(target, duration = 1.5) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;
    function step(now) {
      const elapsed = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - elapsed) * (1 - elapsed);
      setCount(Math.round(eased * target));
      if (elapsed < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, count };
}

function StatCell({ value, suffix, label, icon: Icon }) {
  const { ref, count } = useCountUp(value);
  return (
    <div ref={ref} className="stat-cell">
      <Icon size={18} className="stat-cell-icon" aria-hidden="true" />
      <p className="font-display text-2xl sm:text-3xl leading-none tabular-nums">
        {count}{suffix}
      </p>
      <p className="mt-1 text-[11px] sm:text-xs font-semibold text-surface-600">
        {label}
      </p>
    </div>
  );
}

function scrollToSection(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const navHeight = 72;
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function HomePage() {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [heroCityA, setHeroCityA] = useState('Tokyo');
  const [heroCityB, setHeroCityB] = useState('Berlin');
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const featureLink = useCallback(
    (feat) => (feat.protected && !user ? '/signup' : feat.to),
    [user],
  );

  const handleQuickCompareSubmit = (e) => {
    e.preventDefault();
    if (!heroCityA.trim() || !heroCityB.trim()) return;
    navigate(`/compare?names=${encodeURIComponent(heroCityA.trim())},${encodeURIComponent(heroCityB.trim())}`);
  };

  const handleSelectPreset = (a, b) => {
    setHeroCityA(a);
    setHeroCityB(b);
  };

  const activeSample = SAMPLE_PREVIEWS[activePreviewIndex];

  return (
    <main className="flex-1">
      <ScrollProgress />

      <section
        ref={heroRef}
        aria-label="Hero"
        className="hero-shell relative isolate min-h-[calc(100dvh-72px)] overflow-hidden px-4 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16"
      >
        <motion.picture
          aria-hidden="true"
          className="absolute inset-0 -z-20 block"
          style={{ y: bgY }}
        >
          <source type="image/webp" srcSet={`${aerial640Webp} 640w, ${aerial1280Webp} 1280w, ${aerial1920Webp} 1920w`} sizes="100vw" />
          <img
            src={aerial1280Png}
            srcSet={`${aerial640Png} 640w, ${aerial1280Png} 1280w, ${aerial1920Png} 1920w`}
            sizes="100vw"
            width="1280"
            height="1327"
            alt=""
            fetchPriority="high"
            className="h-full w-full select-none pointer-events-none object-cover object-[35%_30%] sm:object-[42%_30%]"
            style={{ height: '115%', top: '-7.5%', position: 'absolute', width: '100%' }}
          />
        </motion.picture>

        <div aria-hidden="true" className="hero-overlay absolute inset-0 -z-10 pointer-events-none" />
        <div aria-hidden="true" className="hero-grain absolute inset-0 -z-10 pointer-events-none" />
        <div aria-hidden="true" className="hero-glow-orb hero-glow-orb-left" />
        <div aria-hidden="true" className="hero-glow-orb hero-glow-orb-right" />

        <motion.div
          className="relative mx-auto max-w-4xl px-4 py-4 sm:py-6"
          style={{ opacity: heroOpacity }}
        >
          <div className="flex flex-col items-center text-center">
            <motion.span
              variants={heroBadgeVariants}
              initial="hidden"
              animate="visible"
              className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
              2026 Global City Dataset · 500 Cities
            </motion.span>

            <motion.h1
              className="hero-title max-w-3xl text-white mb-3"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {HEADLINE_LINES.map(({ words, key, accent }) => (
                <span key={key} className={key === 'line1' ? 'hero-title-lead block' : 'block'}>
                  {words.map((word, i) => (
                    <span key={word}>
                      <motion.span
                        variants={heroWordVariants}
                        className={`inline-block${accent ? ' hero-accent-word' : ''}`}
                      >
                        {word}
                      </motion.span>
                      {i < words.length - 1 && ' '}
                    </span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="hero-subtitle text-base sm:text-lg text-white/90 mb-5 max-w-xl leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            >
              Compare real cost-of-living, safety, and quality-of-life data across 500 cities — before your next big move.
            </motion.p>

            <motion.div
              variants={heroCTAVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-2xl bg-surface-900/80 backdrop-blur-xl border border-surface-700/60 p-3 sm:p-4 rounded-2xl shadow-2xl mb-4"
            >
              <form onSubmit={handleQuickCompareSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full sm:flex-1">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none" />
                  <input
                    type="text"
                    value={heroCityA}
                    onChange={(e) => setHeroCityA(e.target.value)}
                    placeholder="First city (e.g. Tokyo)"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-950/80 border border-surface-700/60 rounded-xl text-sm font-semibold text-white placeholder-surface-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                    aria-label="First city to compare"
                  />
                </div>

                <div className="hidden sm:flex items-center justify-center size-8 rounded-full bg-surface-800 border border-surface-700 text-brand-300 shrink-0">
                  <Exchange size={14} />
                </div>

                <div className="relative w-full sm:flex-1">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none" />
                  <input
                    type="text"
                    value={heroCityB}
                    onChange={(e) => setHeroCityB(e.target.value)}
                    placeholder="Second city (e.g. Berlin)"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-950/80 border border-surface-700/60 rounded-xl text-sm font-semibold text-white placeholder-surface-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                    aria-label="Second city to compare"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary hero-cta text-sm px-6 py-2.5 w-full sm:w-auto shrink-0 justify-center font-semibold cursor-pointer"
                >
                  Compare <ArrowRight size={16} />
                </motion.button>
              </form>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="text-surface-400 font-medium mr-1">Quick picks:</span>
                {POPULAR_COMPARISONS.slice(0, 4).map(({ a, b }) => (
                  <button
                    key={`${a}-${b}`}
                    type="button"
                    onClick={() => handleSelectPreset(a, b)}
                    className="px-2.5 py-1 rounded-full bg-surface-800/80 hover:bg-surface-700/90 border border-surface-700/60 text-surface-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {a} vs {b}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={heroCTAVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
                <Link to="/compare" className="btn-primary hero-cta text-sm px-5 py-2.5 w-full sm:w-auto">
                  Open Comparison Tool <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="hero-secondary text-sm px-5 py-2.5 w-full sm:w-auto justify-center"
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>

            <motion.p
              className="hero-note text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              No account required · Free forever · Updated for 2026
            </motion.p>
          </div>
        </motion.div>

        <motion.button
          type="button"
          className="scroll-indicator"
          onClick={(e) => scrollToSection(e, 'stats')}
          aria-label="Scroll to learn more"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <ArrowDown size={18} />
        </motion.button>
      </section>

      <section id="stats" className="stat-strip" aria-label="MetroScope highlights">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {STATS.map(({ value, suffix, label, icon }) => (
            <StatCell key={label} value={value} suffix={suffix} label={label} icon={icon} />
          ))}
        </div>
      </section>

      <section className="popular-section px-4 sm:px-6 py-6" aria-label="Popular comparisons">
        <div className="max-w-6xl mx-auto">
          <p className="popular-section-label">Popular comparisons</p>
          <div className="popular-marquee-wrap">
            <div className="popular-marquee">
              {POPULAR_COMPARISONS.map(({ a, b, label }, i) => (
                <Link
                  key={`primary-${label}-${i}`}
                  to={`/compare?names=${a},${b}`}
                  className="popular-chip"
                >
                  <MapPin size={12} aria-hidden="true" />
                  {label}
                </Link>
              ))}
              {POPULAR_COMPARISONS.map(({ a, b, label }, i) => (
                <Link
                  key={`dup-${label}-${i}`}
                  to={`/compare?names=${a},${b}`}
                  className="popular-chip"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <MapPin size={12} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="popular-chips-static sm:hidden mt-3 flex flex-wrap gap-2 justify-center">
            {POPULAR_COMPARISONS.slice(0, 4).map(({ a, b, label }) => (
              <Link key={label} to={`/compare?names=${a},${b}`} className="popular-chip">
                <MapPin size={12} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-20 sm:py-24" aria-label="Live comparison preview">
        <Reveal className="max-w-5xl mx-auto" stagger>
          <RevealItem>
            <p className="eyebrow text-center">See it in action</p>
            <h2 className="section-title text-center mx-auto mb-3">Live side-by-side preview</h2>
            <p className="text-center text-surface-400 text-sm max-w-xl mx-auto mb-8">
              See how MetroScope Flow structures rent, salary, safety, and health data into a single clear decision score.
            </p>

            <div className="flex justify-center mb-8">
              <div className="tab-chip-group p-1 rounded-xl bg-surface-900 border border-surface-700/60 inline-flex gap-1">
                {SAMPLE_PREVIEWS.map((sample, idx) => (
                  <button
                    key={sample.pair}
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activePreviewIndex === idx
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800/60'
                    }`}
                  >
                    {sample.pair}
                  </button>
                ))}
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="glow-card rounded-2xl p-6 sm:p-8 bg-surface-900/80 border border-surface-700/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-800">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-brand-400 flex items-center gap-1.5">
                    <Sparkles size={14} /> Overall Decision Winner
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1">
                    {activeSample.cityA.winner ? activeSample.cityA.name : activeSample.cityB.name} leads this comparison
                  </h3>
                  <p className="text-xs sm:text-sm text-surface-400 mt-1 max-w-xl">
                    {activeSample.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-surface-500 font-semibold block">Decision Score</span>
                    <span className="text-2xl font-extrabold text-brand-300">
                      {activeSample.cityA.winner ? activeSample.cityA.score : activeSample.cityB.score}/100
                    </span>
                  </div>
                  <div className="size-12 rounded-full bg-brand-500/20 border border-brand-400/40 grid place-items-center text-brand-300">
                    <Trophy size={22} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className={`p-5 rounded-xl border ${activeSample.cityA.winner ? 'bg-brand-500/10 border-brand-500/40' : 'bg-surface-950/50 border-surface-800'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{activeSample.cityA.name}</h4>
                      <p className="text-xs text-surface-500">{activeSample.cityA.country}</p>
                    </div>
                    {activeSample.cityA.winner && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Winner
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 border-b border-surface-800/60">
                      <span className="text-surface-400">Avg Monthly Rent</span>
                      <span className="font-semibold text-white font-mono">{activeSample.cityA.rent}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-surface-800/60">
                      <span className="text-surface-400">Avg Annual Salary</span>
                      <span className="font-semibold text-white font-mono">{activeSample.cityA.salary}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-surface-800/60">
                      <span className="text-surface-400">Quality of Life</span>
                      <span className="font-semibold text-brand-300 font-mono">{activeSample.cityA.quality}/100</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-surface-400">Safety Index</span>
                      <span className="font-semibold text-emerald-400 font-mono">{activeSample.cityA.safety}/100</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${activeSample.cityB.winner ? 'bg-brand-500/10 border-brand-500/40' : 'bg-surface-950/50 border-surface-800'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{activeSample.cityB.name}</h4>
                      <p className="text-xs text-surface-500">{activeSample.cityB.country}</p>
                    </div>
                    {activeSample.cityB.winner && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Winner
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 border-b border-surface-800/60">
                      <span className="text-surface-400">Avg Monthly Rent</span>
                      <span className="font-semibold text-white font-mono">{activeSample.cityB.rent}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-surface-800/60">
                      <span className="text-surface-400">Avg Annual Salary</span>
                      <span className="font-semibold text-white font-mono">{activeSample.cityB.salary}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-surface-800/60">
                      <span className="text-surface-400">Quality of Life</span>
                      <span className="font-semibold text-brand-300 font-mono">{activeSample.cityB.quality}/100</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-surface-400">Safety Index</span>
                      <span className="font-semibold text-emerald-400 font-mono">{activeSample.cityB.safety}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 text-center">
                <Link
                  to={`/compare?names=${encodeURIComponent(activeSample.cityA.name)},${encodeURIComponent(activeSample.cityB.name)}`}
                  className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2"
                >
                  Explore Full {activeSample.pair} Comparison <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </section>

      <section className="section-alt px-4 sm:px-6 py-20 sm:py-28" aria-label="Why MetroScope Flow">
        <Reveal className="problem-section">
          <RevealItem>
            <p className="eyebrow">The problem</p>
            <p className="problem-statement">
              Most people make one of the biggest decisions of their life —{' '}
              <span className="problem-highlight">where to live</span> — based on scattered blog posts, gut feelings, and outdated rankings.
            </p>
            <p className="mt-5 problem-statement">
              MetroScope Flow puts <span className="problem-highlight">real, structured data side by side</span> so you can compare what actually matters.
            </p>
          </RevealItem>
        </Reveal>
      </section>

      <section id="how-it-works" className="px-4 sm:px-6 py-20 sm:py-28" aria-label="How it works">
        <Reveal className="max-w-6xl mx-auto" stagger>
          <RevealItem>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title max-w-2xl">Start with the places that make your life feel possible.</h2>
          </RevealItem>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_STEPS.map(({ num, icon: Icon, title, desc }) => (
              <RevealItem key={title}>
                <motion.div
                  className="how-step-card glow-card"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <div className="how-step-num">{num}</div>
                  <div className="how-step-icon">
                    <Icon size={20} className="text-brand-400" />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section-alt px-4 sm:px-6 py-20 sm:py-28" aria-label="Who it's for">
        <Reveal className="max-w-6xl mx-auto" stagger>
          <RevealItem>
            <p className="eyebrow text-center">Built for movers</p>
            <h2 className="section-title text-center mx-auto mb-12">Who uses MetroScope Flow?</h2>
          </RevealItem>
          <div className="grid gap-5 sm:grid-cols-3">
            {USE_CASES.map(({ emoji, title, desc }) => (
              <RevealItem key={title}>
                <div className="use-case-card glow-card">
                  <span className="use-case-emoji" aria-hidden="true">{emoji}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 py-20 sm:py-28" aria-label="Platform features">
        <Reveal className="max-w-6xl mx-auto" stagger>
          <RevealItem>
            <p className="eyebrow text-center">Full toolkit</p>
            <h2 className="section-title text-center mx-auto mb-12">
              Everything you need to <span className="gradient-text">make an informed choice</span>
            </h2>
          </RevealItem>
          <div className="feature-grid">
            {FEATURES.map(({ icon: Icon, title, desc, ...feat }) => (
              <RevealItem key={title}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="h-full"
                >
                  <Link to={featureLink(feat)} className="feature-card glow-card h-full">
                    <div className="flex items-center justify-between">
                      <div className="feature-icon-wrap">
                        <Icon size={20} className="text-brand-400" />
                      </div>
                      {feat.protected && !user && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-800 text-surface-400 border border-surface-700">
                          Free Account
                        </span>
                      )}
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <span className="feature-card-arrow">
                      Explore <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 py-16" aria-label="Data transparency">
        <Reveal>
          <div className="data-trust">
            <div className="data-trust-icon">
              <Database size={22} />
            </div>
            <h2 className="font-display text-lg font-bold mb-3">Our data, upfront</h2>
            <p>
              MetroScope Flow uses an educational dataset modeled on 2026 cost-of-living and quality-of-life patterns across 500 cities. Scores are indexed to New York City (NYC&nbsp;=&nbsp;100). This data is designed for exploratory comparison — not as financial advice or a substitute for professional guidance.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 pb-24" aria-label="Get started">
        <Reveal className="max-w-3xl mx-auto">
          <div className="final-cta-section">
            <h2>Start comparing in under a minute</h2>
            <p>Pick any two cities and see how they stack up — no account required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
                <Link to="/compare" className="btn-primary text-base px-8 py-3.5">
                  Open City Comparison <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
                <Link to="/discover" className="hero-secondary text-base px-8 py-3.5">
                  Take the City Quiz
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
