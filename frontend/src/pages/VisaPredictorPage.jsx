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
          style={{ fontSize: '2rem', fontWeight: 800, fill: 'oklch(0.87 0.12 260)', fontFamily: 'var(--font-display)' }}
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
        <Badge className="mt-1">{confidence} confidence</Badge>
      </motion.div>

      <h2 className="text-xl font-bold text-center">{label}</h2>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1 text-sm font-semibold text-surface-500">
    {label}{children}
  </label>
);

function StepProgress({ step }) {
  return (
    <div className="flex gap-2 mt-7">
      {[1, 2, 3].map((n) => (
        <motion.div
          key={n}
          className="h-2 flex-1 rounded"
          initial={false}
          animate={{ background: n <= step ? 'oklch(0.67 0.22 260)' : 'oklch(0.18 0.04 260)' }}
          transition={{ duration: 0.3 }}
        />
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

        <div className="grid md:grid-cols-[300px_1fr] gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Card className="p-6 flex flex-col items-center text-center">
              <ScoreGauge
                score={result.score}
                label={result.label}
                confidence={result.confidence}
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
          >
            <Card className="p-6">
              <h2 className="font-bold text-lg">How to improve</h2>
              <motion.ol
                className="list-decimal pl-5 mt-3 space-y-2 text-surface-500"
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

              <div className="flex gap-3 mt-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button onClick={save} disabled={saved}>
                    {saved ? 'Saved' : 'Save this result'}
                  </Button>
                </motion.div>
                <Link className="btn-ghost border border-surface-700/60" to="/visa-timeline">
                  View your Visa Timeline →
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
        >
          <Card className="p-5 mt-5">
            <h2 className="font-bold mb-4">Destination competitiveness</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={result.country_rank} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="country" type="category" width={105} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#49b7a1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold">
        Visa <span className="gradient-text">Predictor</span>
      </h1>
      <p className="text-surface-500 mt-2">A practical eligibility estimate, not immigration advice.</p>

      <StepProgress step={step} />

      <Card className="p-6 mt-5">
        <p className="text-xs uppercase tracking-widest text-brand-400 mb-5">Step {step} of 3</p>

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
                  <select className="input-base" value={form.destination_country} onChange={(e) => patch('destination_country', e.target.value)}>
                    {countries.map((c) => <option key={c}>{c}</option>)}
                  </select>
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
                  <select className="input-base" value={form.education_level} onChange={(e) => patch('education_level', e.target.value)}>
                    {['phd','masters','bachelors','diploma','high_school'].map((v) => <option key={v}>{v.replace('_', ' ')}</option>)}
                  </select>
                </Field>
                <Field label="Work experience (years)">
                  <Input type="number" value={form.work_experience_years} onChange={(e) => patch('work_experience_years', Number(e.target.value))} />
                </Field>
                <Field label="IELTS band">
                  <Input type="number" step="0.5" value={form.language_score.ielts_band} onChange={(e) => patch('language_score', { ielts_band: Number(e.target.value) })} />
                </Field>
                <Field label="Field">
                  <select className="input-base" value={form.field} onChange={(e) => patch('field', e.target.value)}>
                    {['stem','healthcare','arts','business','other'].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="flex gap-2 items-center">
                  <input type="checkbox" checked={form.has_job_offer} onChange={(e) => patch('has_job_offer', e.target.checked)} />
                  I have a qualifying job offer
                </label>
                <p className="font-bold">Documents ready</p>
                {Object.keys(form.documents).map((key) => (
                  <label className="flex gap-2 items-center capitalize" key={key}>
                    <input type="checkbox" checked={form.documents[key]} onChange={(e) => patch('documents', { ...form.documents, [key]: e.target.checked })} />
                    {key.replace('_', ' ')}
                  </label>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-7">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {step < 3
              ? <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
              : <Button onClick={submit} disabled={loading}>{loading ? 'Calculating…' : 'See my outlook'}</Button>
            }
          </motion.div>
        </div>
      </Card>
    </main>
  );
}
