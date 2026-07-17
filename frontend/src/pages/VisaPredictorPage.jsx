import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, Input, Card, Badge, useToast } from '../components/ui.jsx';
import { predictVisa, saveVisaResult } from '../api/tools.js';
import { EASE, fadeUp, staggerContainer, SPRING_POP } from '../lib/motion.js';

const countries = [
  'Canada', 'Germany', 'Australia', 'United Kingdom', 'United States',
  'Netherlands', 'Sweden', 'New Zealand', 'Singapore', 'Japan',
];

const initial = {
  destination_country: 'Canada',
  passport_country: 'India',
  age: 28,
  education_level: 'bachelors',
  work_experience_years: 2,
  language_score: { ielts_band: 6.5 },
  has_job_offer: false,
  documents: { passport: false, health_insurance: false, funds_proof: false },
  field: 'stem',
};

function useCountUp(target, duration = 700) {
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
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * targetRef.current));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const GAUGE_R   = 56;   
const GAUGE_CX  = 80;   
const GAUGE_CY  = 80;  
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R;

function ScoreGauge({ score, label, confidence }) {
  const counted        = useCountUp(score, 700);
  const dashOffset     = GAUGE_CIRC - (counted / 100) * GAUGE_CIRC;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        aria-label={`Visa score ${score} out of 100`}
        role="img"
        className="filter drop-shadow-[0_0_12px_oklch(0.67_0.22_260_/_0.3)]"
      >
        <circle
          cx={GAUGE_CX}
          cy={GAUGE_CY}
          r={GAUGE_R}
          fill="none"
          stroke="oklch(0.25 0.04 260)"
          strokeWidth="10"
        />
        <motion.circle
          cx={GAUGE_CX}
          cy={GAUGE_CY}
          r={GAUGE_R}
          fill="none"
          stroke="oklch(0.67 0.22 260)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={GAUGE_CIRC}
          strokeDashoffset={dashOffset}
          style={{ rotate: '-90deg', transformOrigin: `${GAUGE_CX}px ${GAUGE_CY}px` }}
          initial={{ strokeDashoffset: GAUGE_CIRC }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <text
          x={GAUGE_CX}
          y={GAUGE_CY + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-display"
          style={{ fontSize: '2rem', fontWeight: 800, fill: 'oklch(0.92 0.02 260)', fontFamily: 'var(--font-display)' }}
        >
          {counted}
        </text>
        <text
          x={GAUGE_CX}
          y={GAUGE_CY + 24}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '0.65rem', fill: 'oklch(0.58 0.04 260)', textTransform: 'uppercase', letterSpacing: '0.06em' }}
        >
          out of 100
        </text>
      </svg>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_POP, delay: 0.5 }}
      >
        <Badge className="mt-1 bg-brand-500/20 border-brand-500/40 text-brand-400 font-bold">{confidence} confidence</Badge>
      </motion.div>

      <h2 className="text-xl font-extrabold text-center mt-1">{label}</h2>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-sm font-semibold text-surface-400">
    {label}{children}
  </label>
);

function StepProgress({ step }) {
  return (
    <div className="flex gap-2.5 mt-7">
      {[1, 2, 3].map((n) => (
        <motion.div
          key={n}
          className="h-2 flex-1 rounded-full overflow-hidden bg-surface-900 border border-surface-700/40"
          initial={false}
        >
          <motion.div
            className="h-full bg-brand-400 rounded-full shadow-[0_0_8px_oklch(0.67_0.22_260_/_0.5)]"
            animate={{ width: n <= step ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function VisaPredictorPage() {
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState(initial);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const toast = useToast();

  const patch = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setLoading(true);
    try {
      setResult((await predictVisa(form)).data.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      await saveVisaResult(form, result);
      setSaved(true);
      toast.success('Visa result saved.');
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (result) {
    return (
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <motion.h1
          className="text-3xl font-extrabold mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          Your <span className="gradient-text">Visa outlook</span>
        </motion.h1>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="glow-card rounded-2xl p-6 flex flex-col items-center text-center h-full justify-center">
              <ScoreGauge
                score={result.score}
                label={result.label}
                confidence={result.confidence}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
          >
            <div className="glow-card rounded-2xl p-6">
              <h2 className="font-extrabold text-lg">How to improve your score</h2>
              <motion.ol
                className="list-decimal pl-5 mt-4 space-y-2.5 text-surface-300 text-sm"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                transition={{ delayChildren: 0.75 }}
              >
                {result.improvement_tips.map((tip) => (
                  <motion.li key={tip} variants={fadeUp}>
                    {tip}
                  </motion.li>
                ))}
              </motion.ol>

              <div className="flex flex-wrap gap-3 mt-8 pt-5 border-t border-surface-700/40">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button onClick={save} disabled={saved} className="shadow-md">
                    {saved ? 'Saved to Profile' : 'Save this result'}
                  </Button>
                </motion.div>
                <Link className="btn-ghost border border-surface-700/60 rounded-xl px-4 text-xs font-semibold" to="/visa-timeline">
                  View your Visa Timeline →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
        >
          <div className="glow-card rounded-2xl p-6 mt-6">
            <h2 className="font-extrabold text-lg mb-4">Destination competitiveness</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={result.country_rank} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="oklch(0.44 0.04 260)" />
                  <YAxis dataKey="country" type="category" width={110} stroke="oklch(0.72 0.02 260)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'oklch(0.14 0.03 260)', borderColor: 'oklch(0.35 0.04 260 / 0.6)', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="score" fill="oklch(0.67 0.22 260)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold">
        Visa <span className="gradient-text">Predictor</span>
      </h1>
      <p className="text-surface-500 mt-2">A practical eligibility estimate based on country criteria.</p>

      <StepProgress step={step} />

      <div className="glow-card rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs uppercase tracking-widest text-brand-400 font-extrabold">Step {step} of 3</p>
          <span className="text-xs text-surface-500">{step === 1 ? 'Destination & Demographics' : step === 2 ? 'Education & Experience' : 'Job Offer & Readiness'}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Destination">
                  <div className="select-wrapper">
                    <select value={form.destination_country} onChange={(e) => patch('destination_country', e.target.value)}>
                      {countries.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Passport country">
                  <Input value={form.passport_country} onChange={(e) => patch('passport_country', e.target.value)} />
                </Field>
                <Field label="Age">
                  <Input type="number" value={form.age} onChange={(e) => patch('age', Number(e.target.value))} />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Education">
                  <div className="select-wrapper">
                    <select value={form.education_level} onChange={(e) => patch('education_level', e.target.value)}>
                      {['phd','masters','bachelors','diploma','high_school'].map((v) => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Work experience (years)">
                  <Input type="number" value={form.work_experience_years} onChange={(e) => patch('work_experience_years', Number(e.target.value))} />
                </Field>
                <Field label="IELTS band">
                  <Input type="number" step="0.5" value={form.language_score.ielts_band} onChange={(e) => patch('language_score', { ielts_band: Number(e.target.value) })} />
                </Field>
                <Field label="Field">
                  <div className="select-wrapper">
                    <select value={form.field} onChange={(e) => patch('field', e.target.value)}>
                      {['stem','healthcare','arts','business','other'].map((v) => <option key={v} className="capitalize">{v}</option>)}
                    </select>
                  </div>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <label className="checkbox-container">
                  <input type="checkbox" checked={form.has_job_offer} onChange={(e) => patch('has_job_offer', e.target.checked)} />
                  <span className="checkbox-checkmark" />
                  <span className="font-semibold">I have a qualifying job offer</span>
                </label>

                <div className="pt-3 border-t border-surface-700/40">
                  <p className="font-bold text-sm text-surface-300 mb-3">Documents ready</p>
                  <div className="space-y-3">
                    {Object.keys(form.documents).map((key) => (
                      <label className="checkbox-container capitalize" key={key}>
                        <input type="checkbox" checked={form.documents[key]} onChange={(e) => patch('documents', { ...form.documents, [key]: e.target.checked })} />
                        <span className="checkbox-checkmark" />
                        <span>{key.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-5 border-t border-surface-700/40">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {step < 3
              ? <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
              : <Button onClick={submit} disabled={loading} className="shadow-md">{loading ? 'Calculating…' : 'See my outlook'}</Button>
            }
          </motion.div>
        </div>
      </div>
    </main>
  );
}
