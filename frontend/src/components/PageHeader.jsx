import { motion } from 'motion/react';
import { EASE } from '../lib/motion.js';

export default function PageHeader({ eyebrow, title, titleAccent, description, children, className = '' }) {
  return (
    <motion.header
      className={`page-header ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {eyebrow && <p className="page-header-eyebrow">{eyebrow}</p>}
      <h1 className="page-header-title">
        {title}
        {titleAccent && <span className="gradient-text"> {titleAccent}</span>}
      </h1>
      {description && <p className="page-header-desc">{description}</p>}
      {children}
    </motion.header>
  );
}
