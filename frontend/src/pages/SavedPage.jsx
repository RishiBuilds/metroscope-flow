import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkX, BookmarkCheck, ArrowRight, Loader2, Trash2, AlertCircle, Globe2 } from '../components/icons.jsx';
import { listComparisons, deleteComparison } from '../api/comparisons.js';
import { CITY_COLORS } from '../components/ComparisonCharts.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { Modal, useToast } from '../components/ui.jsx';
import { fadeUp, staggerContainer, T_DEFAULT } from '../lib/motion.js';

function relativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ConfirmDeleteDialog({ name, onConfirm, onCancel, deleting }) {
  return (
    <Modal title="Delete comparison" onClose={onCancel}>
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-bold">Delete comparison?</h2>
            <p className="text-sm text-surface-600 mt-0.5 leading-relaxed">
              "<span className="text-white">{name}</span>" will be permanently removed.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={deleting} className="btn-ghost flex-1 border border-surface-700/60 text-sm">
            Cancel
          </button>
          <motion.button
            onClick={onConfirm}
            disabled={deleting}
            className="btn-danger flex-1 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete
          </motion.button>
        </div>
    </Modal>
  );
}

function ComparisonCard({ comp, onDelete }) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const toast = useToast();

  const compareUrl = `/compare?ids=${comp.cityIds.map((c) => c._id).join(',')}`;
  const handleOpen = () => navigate(compareUrl);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteComparison(comp._id);
      onDelete(comp._id);
      toast.success('Saved comparison deleted.');
    } catch {
      setDeleting(false);
      setConfirmOpen(false);
      toast.error('Could not delete this comparison. Please try again.');
    }
  };

  return (
    <>
      <motion.div
        className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
        variants={fadeUp}
        whileHover={{ y: -4, boxShadow: '0 16px 36px oklch(0.04 0.02 260 / 0.28)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      >
        <div className="w-10 h-10 rounded-xl bg-brand-900/60 flex items-center justify-center shrink-0">
          <BookmarkCheck size={18} className="text-brand-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">{comp.name}</h3>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {comp.cityIds.map((city, i) => (
              <span
                key={city._id}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                style={{
                  color: CITY_COLORS[i % CITY_COLORS.length],
                  borderColor: `${CITY_COLORS[i % CITY_COLORS.length]}40`,
                  background: `${CITY_COLORS[i % CITY_COLORS.length]}12`,
                }}
              >
                <Globe2 size={10} />
                {city.city}
              </span>
            ))}
          </div>
          <p className="text-xs text-surface-600 mt-1.5">Saved {relativeDate(comp.createdAt)}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            onClick={() => setConfirmOpen(true)}
            id={`delete-comp-${comp._id}`}
            className="btn-ghost p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
            aria-label="Delete comparison"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
          <motion.button
            onClick={handleOpen}
            id={`open-comp-${comp._id}`}
            className="btn-primary text-sm py-2 px-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Open <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmOpen && (
          <ConfirmDeleteDialog
            name={comp.name}
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function SavedPage() {
  const [comps, setComps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchComps = useCallback(() => {
    setLoading(true);
    setError('');
    listComparisons()
      .then((res) => setComps(res.data.data ?? []))
      .catch(() => setError('Could not load saved comparisons. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchComps(); }, [fetchComps]);

  const handleDelete = (id) => setComps((prev) => prev.filter((c) => c._id !== id));

  return (
    <main className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full">

      <div className="flex items-center justify-between mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Saved <span className="gradient-text">Comparisons</span>
          </h1>
          {!loading && !error && (
            <p className="text-sm text-surface-600 mt-1">
              {comps.length} {comps.length === 1 ? 'comparison' : 'comparisons'} saved
            </p>
          )}
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
          <Link to="/compare" className="btn-primary text-sm py-2 px-4 shrink-0">
            + New
          </Link>
        </motion.div>
      </div>

      {loading && (
        <div className="flex flex-col gap-3" aria-live="polite" aria-busy="true">
          <Skeleton.CompCard />
          <Skeleton.CompCard />
          <Skeleton.CompCard />
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && comps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-900/40 flex items-center justify-center">
            <BookmarkX size={30} className="text-brand-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-1">No saved comparisons yet</h2>
            <p className="text-sm text-surface-600 max-w-xs">
              Compare cities and hit "Save this comparison" to bookmark it here for later.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={T_DEFAULT}>
            <Link to="/compare" id="saved-empty-cta" className="btn-primary px-6 py-2.5">
              Start Comparing <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      )}

      {!loading && !error && comps.length > 0 && (
        <motion.div
          className="flex flex-col gap-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {comps.map((comp) => (
            <ComparisonCard key={comp._id} comp={comp} onDelete={handleDelete} />
          ))}
        </motion.div>
      )}
    </main>
  );
}
