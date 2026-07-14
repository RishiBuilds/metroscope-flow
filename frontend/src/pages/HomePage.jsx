import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, BarChart3, ShieldCheck, Globe2 } from '../components/icons.jsx';
import Reveal from '../components/Reveal.jsx';
import { RevealItem } from '../components/Reveal.jsx';
import { fadeUp, staggerContainer, SPRING_CARD, EASE, T_DEFAULT } from '../lib/motion.js';
import aerial640Png from '../assets/aerial_view-bg-640w.png';
import aerial1280Png from '../assets/aerial_view-bg.png';
import aerial1920Png from '../assets/aerial_view-bg-1920w.png';
import aerial640Webp from '../assets/aerial_view-bg-640w.webp';
import aerial1280Webp from '../assets/aerial_view-bg.webp';
import aerial1920Webp from '../assets/aerial_view-bg-1920w.webp';

const FEATURES = [
  { icon: BarChart3, title: 'Side-by-Side Metrics', desc: 'Compare rent, salary, healthcare, safety, and more at a glance.' },
  { icon: Globe2, title: '500 Global Cities', desc: 'Explore locations across North America, Europe, Asia, South America, and Africa.' },
  { icon: ShieldCheck, title: 'Save Your Comparisons', desc: 'Bookmark the choices worth returning to when it is time to decide.' },
];

const HEADLINE_LINES = [
  { words: ['Know', 'before'], key: 'line1' },
  { words: ['you', 'move.'],   key: 'line2' },
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

export default function HomePage() {
  const heroRef = useRef(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '18%']);

  return (
    <main className="flex-1">
      <section
        ref={heroRef}
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
              MetroScope Flow brings cost of living, safety, healthcare, and quality-of-life data across 500 global cities into one clear decision space.
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
                <Link to="/signup" className="hero-secondary text-base px-6 py-3 w-full sm:w-auto justify-center">
                  Create Free Account
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              className="hero-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            >
              Educational dataset · illustrative estimates for exploratory comparison.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="stat-strip" aria-label="MetroScope highlights">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-current/15">
          {[['500+', 'Cities covered'], ['9', 'Metrics tracked'], ['Free', 'To explore']].map(([value, label]) => (
            <div key={label} className="py-5 px-3 text-center">
              <p className="font-display text-2xl sm:text-3xl leading-none">{value}</p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold text-surface-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-6xl mx-auto" stagger>
          <RevealItem>
            <p className="eyebrow">A clearer decision, in three moves</p>
            <h2 className="section-title max-w-2xl">Start with the places that make your life feel possible.</h2>
          </RevealItem>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ['01', 'Pick cities', 'Build a short list of the places calling your name.'],
              ['02', 'Compare metrics', 'See the trade-offs that are usually hidden in plain sight.'],
              ['03', 'Save & decide', 'Keep your best comparisons close when it is time to choose.'],
            ].map(([number, title, description]) => (
              <RevealItem key={title}>
                <motion.div
                  className="how-step"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 py-20">
        <Reveal className="max-w-5xl mx-auto" stagger>
          <RevealItem>
            <h2 className="section-title text-center mx-auto mb-12">
              Everything you need to <span className="gradient-text">make an informed choice</span>
            </h2>
          </RevealItem>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <RevealItem key={title}>
                <motion.div
                  className="glass rounded-2xl p-6 flex flex-col gap-3 h-full"
                  whileHover={{ y: -4, boxShadow: '0 16px 36px oklch(0.04 0.02 260 / 0.28)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-900/60 flex items-center justify-center">
                    <Icon size={20} className="text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-base">{title}</h3>
                  <p className="text-sm text-surface-600 leading-relaxed">{desc}</p>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 pb-20">
        <Reveal className="max-w-3xl mx-auto glass rounded-2xl p-8 sm:p-12 text-center hero-final-cta">
          <h2 className="section-title text-white mb-4">Ready to find your next city?</h2>
          <p className="text-white/75 mb-8">Pick any two cities and see how they compare in seconds.</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT} className="inline-block">
            <Link to="/compare" className="btn-primary text-base px-8 py-3">
              Open City Comparison <ArrowRight size={18} />
            </Link>
          </motion.div>
        </Reveal>
      </section>
    </main>
  );
}
