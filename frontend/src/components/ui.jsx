import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from './icons.jsx';
import { Button as NeoButton } from './ui/button.jsx';
import { Input as NeoInput } from './ui/input.jsx';
import { Card as NeoCard } from './ui/card.jsx';
import { Badge as NeoBadge } from './ui/badge.jsx';
import { EASE } from '../lib/motion.js';

export function Button({ variant = 'primary', className = '', ...props }) {
  const neoVariant = variant === 'ghost' ? 'neutral' : 'default';
  return <NeoButton variant={neoVariant} className={`btn-${variant} ${className}`} {...props} />;
}
export function Card({ className = '', children, ...props }) {
  return <NeoCard className={`card ${className}`} {...props}>{children}</NeoCard>;
}
export function Badge({ className = '', children, ...props }) {
  return <NeoBadge className={`badge ${className}`} {...props}>{children}</NeoBadge>;
}
export function Input({ className = '', ...props }) {
  return <NeoInput className={`input-base ${className}`} {...props} />;
}

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ success: (m) => push(m), error: (m) => push(m, 'error') }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map(({ id, message, type }) => (
            <motion.div
              key={id}
              role="status"
              className={`toast toast-${type}`}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0,  opacity: 1 }}
              exit={{   x: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              layout
            >
              {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message}</span>
              <button onClick={() => dismiss(id)} aria-label="Dismiss notification">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }

export function Modal({ title, children, onClose, labelledBy = 'modal-title', className = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const focusable = () =>
      [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => !el.disabled
      );
    focusable()[0]?.focus();

    const keydown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last  = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };

    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [onClose]);

  return (
    <>
      <motion.div
        className="modal-backdrop"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          ref={dialogRef}
          className={`modal-panel ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          exit={{   scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {title && <h2 id={labelledBy} className="sr-only">{title}</h2>}
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}
