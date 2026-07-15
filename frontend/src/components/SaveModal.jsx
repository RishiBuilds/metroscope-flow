import { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, X, Loader2 } from './icons.jsx';
import { saveComparison } from '../api/comparisons.js';
import { Modal, useToast } from './ui.jsx';

export default function SaveModal({ cityIds, defaultName, onClose }) {
  const [name, setName]       = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const toast = useToast();

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await saveComparison({ cityIds, name: name.trim() || defaultName });
      toast.success('Comparison saved!');
      onClose();
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Could not save. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Modal title="Save comparison" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Bookmark size={18} className="text-brand-400" />
            Save Comparison
          </h2>
          <button type="button" onClick={onClose} className="btn-ghost p-1.5" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label htmlFor="save-name" className="text-sm font-medium text-surface-400">
            Label (optional)
          </label>
          <input
            id="save-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={defaultName}
            maxLength={100}
            className="input-base"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-3" role="alert">{error}</p>
        )}

        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 border border-surface-700/60 text-sm">
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
