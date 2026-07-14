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
        <Card className="p-5 mt-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <select className="input-base" value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="input-base" value={moveType} onChange={(e) => setMoveType(e.target.value)}>
              {['work', 'study', 'retirement', 'family'].map((x) => <option key={x}>{x}</option>)}
            </select>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={generate} className="w-full">
                {list ? 'Regenerate' : 'Generate checklist'}
              </Button>
            </motion.div>
          </div>
        </Card>
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
            <div className="mt-6 flex justify-between text-sm">
              <span>{done} of {total} complete</span>
              <span>{pct}%</span>
            </div>
            <div className="h-3 bg-surface-800 rounded mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-brand-400 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>

            <motion.div
              className="space-y-4 mt-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {groups.map(([category, items]) => (
                <motion.div key={category} variants={fadeUp}>
                  <Card className="p-5">
                    <div className="flex justify-between">
                      <h2 className="font-bold">{category}</h2>
                      <span className="text-xs text-brand-400">
                        {items.filter((i) => i.done).length}/{items.length}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {items.map((item) => (
                        <motion.label
                          key={item.id}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.12 }}
                        >
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => toggle(item)}
                          />
                          {item.text}
                        </motion.label>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
