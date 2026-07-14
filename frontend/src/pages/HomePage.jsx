import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import {
  ArrowRight, BarChart3, ShieldCheck, Compass, ChartRadar, BookmarkPlus,
  AirplaneTakeOff, RoutePath, BookOpen, CheckListIcon2, Database, Globe2,
} from '../components/icons.jsx';
import Reveal from '../components/Reveal.jsx';
import { RevealItem } from '../components/Reveal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fadeUp, staggerContainer, SPRING_CARD, EASE, T_DEFAULT,
} from '../lib/motion.js';
import aerial640Png from '../assets/aerial_view-bg-640w.png';
import aerial1280Png from '../assets/aerial_view-bg.png';
import aerial1920Png from '../assets/aerial_view-bg-1920w.png';
import aerial640Webp from '../assets/aerial_view-bg-640w.webp';
import aerial1280Webp from '../assets/aerial_view-bg.webp';
import aerial1920Webp from '../assets/aerial_view-bg-1920w.webp';

const HEADLINE_LINES = [
  { words: ['Know', 'before'], key: 'line1' },
  { words: ['you', 'move.'],   key: 'line2' },
];

const HOW_STEPS = [
  { num: '01', icon: Compass,      title: 'Pick cities',     desc: 'Search 500+ cities and build your shortlist.' },
  { num: '02', icon: ChartRadar,   title: 'Compare metrics', desc: 'See rent, salary, safety, healthcare, and more at a glance.' },
  { num: '03', icon: BookmarkPlus, title: 'Save & decide',   desc: 'Bookmark your best comparisons and revisit when ready.' },
];

const FEATURES = [
  { icon: BarChart3,       title: 'City Comparison',       desc: 'Compare 2–4 cities across 9 key metrics with winner highlights.',          to: '/compare',        protected: false },
  { icon: AirplaneTakeOff, title: 'Visa Predictor',        desc: 'Get a weighted eligibility estimate and improvement tips.',                 to: '/visa-predictor', protected: true },
  { icon: RoutePath,       title: 'Visa Timeline',         desc: 'Follow a six-phase relocation roadmap tailored to your prediction.',        to: '/visa-timeline',  protected: true },
  { icon: BookOpen,        title: 'Culture Guide',         desc: 'Explore cultural insights for your destination country.',                   to: '/culture-guide',  protected: true },
  { icon: CheckListIcon2,  title: 'Relocation Checklist',  desc: 'Track your move with a country-specific, persistent checklist.',            to: '/checklist',      protected: true },
  { icon: ShieldCheck,     title: 'Saved Comparisons',     desc: 'Save, name, and reload your city comparisons anytime.',                    to: '/saved',          protected: true },
];

const STATS = [
  { value: 500, suffix: '+', label: 'Cities Covered' },
  { value: 9,   suffix: '',  label: 'Metrics Tracked' },
  { value: 100, suffix: '%', label: 'Free to Use' },
  { value: 2026, suffix: '', label: 'Dataset Year' },
];

const PREVIEW_CITIES = [
  {
    name: 'Tokyo', country: 'Japan',
    metrics: [
      { label: 'Avg Rent',     value: 72 },
      { label: 'Safety',       value: 88 },
      { label: 'Healthcare',   value: 91 },
      { label: 'Quality',      value: 82 },
    ],
  },
  {
    name: 'Berlin', country: 'Germany',
    metrics: [
      { label: 'Avg Rent',     value: 58 },
      { label: 'Safety',       value: 79 },
      { label: 'Healthcare',   value: 85 },
      { label: 'Quality',      value: 78 },
    ],
  },
];

const heroContainerVariants = {
  hidden:  {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.07,
    },
  },
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
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.45, delay: 0.55, ease: EASE } },
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

function StatCell({ value, suffix, label }) {
  const { ref, count } = useCountUp(value);
  return (
    <div ref={ref} className="py-5 px-3 text-center">
      <p className="font-display text-2xl sm:text-3xl leading-none">
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

function PreviewBar({ label, value, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div className="preview-metric" ref={ref}>
      <span className="preview-metric-label">{label}</span>
      <div className="preview-bar-track">
        <div
          className={`preview-bar-fill${accent ? ' accent' : ''}`}
          style={{ width: inView ? `${value}%` : '0%' }}
        />
      </div>
      <span className="preview-metric-value">{value}</span>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { user } = useAuth();

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);

  const featureLink = useCallback(
    (feat) => (feat.protected && !user ? '/signup' : feat.to),
    [user],
  );

  return (
    <main className="flex-1">
      <section
        ref={heroRef}
        aria-label="Hero"
        className="hero-shell relative isolate min-h-[680px] overflow-hidden px-4 pt-28 pb-16 sm:min-h-[760px] sm:px-6 sm:pt-36 sm:pb-24"
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

        <div className="relative mx-auto grid max-w-6xl items-center">
          <div className="flex flex-col items-center text-center px-4 py-7 sm:px-10 sm:py-10">

            <motion.span
              variants={heroBadgeVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/70 text-white border border-white/35 mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
              2026 Global City Dataset · 500 Cities
            </motion.span>

            <motion.h1
              className="hero-title max-w-5xl text-white mb-6 [text-shadow:0_2px_16px_rgba(0,0,0,0.75)]"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="hero-title-lead block">
                {HEADLINE_LINES[0].words.map((word) => (
                  <motion.span
                    key={word}
                    variants={heroWordVariants}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block">
                {HEADLINE_LINES[1].words.map((word) => (
                  <motion.span
                    key={word}
                    variants={heroWordVariants}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              className="hero-subtitle text-base sm:text-lg text-white/95 mb-8 max-w-xl leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            >
              Compare real cost-of-living, safety, and quality-of-life data across 500 cities before your next big move.
            </motion.p>

            <motion.div
              variants={heroCTAVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
                <Link to="/compare" className="btn-primary hero-cta text-base px-6 py-3 w-full sm:w-auto">
                  Start Comparing <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="hero-secondary text-base px-6 py-3 w-full sm:w-auto justify-center"
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>

            <motion.p
              className="hero-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              500+ cities · 9 comparison metrics · 100% free
            </motion.p>
          </div>
        </div>
      </section>

      <section className="stat-strip" aria-label="MetroScope highlights">
        <div className="max-w-6xl mx-auto grid grid-cols-4 divide-x divide-current/15">
          {STATS.map(({ value, suffix, label }) => (
            <StatCell key={label} value={value} suffix={suffix} label={label} />
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-20 sm:py-28" aria-label="Why MetroScope Flow">
        <Reveal className="problem-section">
          <RevealItem>
            <p>
              Most people make one of the biggest decisions of their life — <span className="problem-highlight">where to live</span> — based on scattered blog posts, gut feelings, and outdated rankings.
            </p>
            <p className="mt-4">
              MetroScope Flow puts <span className="problem-highlight">real, structured data side by side</span> so you can compare what actually matters.
            </p>
          </RevealItem>
        </Reveal>
      </section>

      <section id="how-it-works" className="px-4 sm:px-6 py-20 sm:py-28" aria-label="How it works">
        <Reveal className="max-w-6xl mx-auto" stagger>
          <RevealItem>
            <p className="eyebrow">A clearer decision, in three moves</p>
            <h2 className="section-title max-w-2xl">Start with the places that make your life feel possible.</h2>
          </RevealItem>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW_STEPS.map(({ num, icon: Icon, title, desc }) => (
              <RevealItem key={title}>
                <motion.div
                  className="how-step"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={22} className="text-brand-400" />
                    <span>{num}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 py-20" aria-label="Platform features">
        <Reveal className="max-w-6xl mx-auto" stagger>
          <RevealItem>
            <h2 className="section-title text-center mx-auto mb-12">
              Everything you need to <span className="gradient-text">make an informed choice</span>
            </h2>
          </RevealItem>
          <div className="feature-grid">
            {FEATURES.map(({ icon: Icon, title, desc, ...feat }) => (
              <RevealItem key={title}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 16px 36px oklch(0.04 0.02 260 / 0.28)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <Link to={featureLink(feat)} className="feature-card glass h-full">
                    <div className="feature-icon-wrap">
                      <Icon size={20} className="text-brand-400" />
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </Link>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 py-20" aria-label="Comparison preview">
        <Reveal className="preview-section" stagger>
          <RevealItem>
            <p className="eyebrow text-center">See it in action</p>
            <h2 className="section-title text-center mx-auto mb-2">Example comparison preview</h2>
            <p className="text-center text-surface-600 text-sm mb-10">Illustrative data — not a live comparison.</p>
          </RevealItem>
          <RevealItem>
            <div className="preview-card glass">
              <div className="grid sm:grid-cols-2 gap-8">
                {PREVIEW_CITIES.map((city, ci) => (
                  <div key={city.name} className="preview-city-col">
                    <h4>
                      {city.name} <span className="text-surface-600 font-normal text-sm ml-1">{city.country}</span>
                    </h4>
                    {city.metrics.map((m) => (
                      <PreviewBar
                        key={m.label}
                        label={m.label}
                        value={m.value}
                        accent={ci === 1}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>
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
              MetroScope Flow uses an educational dataset modeled on 2026 cost-of-living and quality-of-life patterns across 500 cities. Scores are indexed to New York City (NYC&nbsp;=&nbsp;100). This data is designed for exploratory comparison — not as financial advice or a substitute for professional guidance. We're upfront about our data because transparency builds trust.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 pb-20" aria-label="Get started">
        <Reveal className="max-w-3xl mx-auto">
          <div className="final-cta-section">
            <h2>Start comparing in under a minute</h2>
            <p>Pick any two cities and see how they stack up — no account required.</p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT} className="inline-block">
              <Link to="/compare" className="btn-primary text-base px-8 py-3">
                Open City Comparison <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
