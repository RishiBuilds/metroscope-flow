import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, useToast } from '../components/ui.jsx';
import { generateChecklist, getChecklist, toggleChecklistItem } from '../api/tools.js';
import { fadeUp, staggerContainer, EASE } from '../lib/motion.js';

const countries = [
  'Canada', 'Germany', 'Australia', 'United Kingdom', 'United States',
  'Netherlands', 'Sweden', 'New Zealand', 'Singapore', 'Japan',
];

export default function ChecklistPage() {
  const [list,     setList]     = useState(undefined);
  const [country,  setCountry]  = useState('Canada');
  const [moveType, setMoveType] = useState('work');
  const toast = useToast();

  useEffect(() => {
    getChecklist()
      .then((r) => setList(r.data.data))
      .catch(() => setList(null));
  }, []);

  const groups = useMemo(
    () => Object.entries(
      (list?.items || []).reduce((acc, item) => ({
        ...acc,
        [item.category]: [...(acc[item.category] || []), item],
      }), {})
    ),
    [list]
  );

  const generate = async () => {
    if (list && !window.confirm('This will replace your active checklist and reset its progress. Continue?')) return;
    try {
      setList((await generateChecklist({ destination_country: country, move_type: moveType })).data.data);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggle = async (item) => {
    const updated = { ...list, items: list.items.map((i) => i.id === item.id ? { ...i, done: !i.done } : i) };
    setList(updated);
    try {
      await toggleChecklistItem(list._id, item.id, !item.done);
    } catch (e) {
      setList(list);
      toast.error(e.message);
    }
  };

  const total = list?.items?.length || 0;
  const done  = list?.items?.filter((i) => i.done).length || 0;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      <motion.h1
        className="text-3xl font-extrabold"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        Relocation <span className="gradient-text">Checklist</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
      >
        <div className="glow-card rounded-2xl p-6 mt-6">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="select-wrapper">
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="select-wrapper">
              <select value={moveType} onChange={(e) => setMoveType(e.target.value)}>
                {['work', 'study', 'retirement', 'family'].map((x) => <option key={x} className="capitalize">{x}</option>)}
              </select>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={generate} className="w-full shadow-md">
                {list ? 'Regenerate' : 'Generate checklist'}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {list && (
          <motion.div
            key="checklist-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="mt-8 flex justify-between text-sm font-semibold">
              <span className="text-surface-300">{done} of {total} complete</span>
              <span className="text-brand-400 font-extrabold">{pct}%</span>
            </div>
            <div className="h-3 bg-surface-900/80 border border-surface-700/40 rounded-full mt-2 overflow-hidden p-0.5 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full shadow-[0_0_12px_oklch(0.55_0.24_260_/_0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>

            <motion.div
              className="space-y-5 mt-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {groups.map(([category, items]) => (
                <motion.div key={category} variants={fadeUp}>
                  <div className="glow-card rounded-2xl p-6">
                    <div className="flex justify-between items-center border-b border-surface-700/40 pb-3">
                      <h2 className="font-extrabold text-lg">{category}</h2>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400">
                        {items.filter((i) => i.done).length}/{items.length}
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {items.map((item) => (
                        <motion.label
                          key={item.id}
                          className={`checkbox-container ${item.done ? 'done' : ''}`}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.12 }}
                        >
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => toggle(item)}
                          />
                          <span className="checkbox-checkmark" />
                          <span>{item.text}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
