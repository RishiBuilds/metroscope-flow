import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "../lib/motion.js";

/**
 * Reveal component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {number} [props.delay]
 * @param {boolean} [props.stagger]
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
}) {
  return (
    <motion.div
      className={className}
      variants={stagger ? staggerContainer : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={delay ? { delay: delay / 1000 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}