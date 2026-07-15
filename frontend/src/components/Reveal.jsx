import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer, reducedVariants } from "../lib/motion.js";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {number} [props.delay] 
 * @param {boolean} [props.stagger] 
 * @param {string} [props.as] 
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
  as = "div",
}) {
  const prefersReduced = useReducedMotion();
  const baseVariants = stagger ? staggerContainer : fadeUp;
  const variants = reducedVariants(prefersReduced, baseVariants);

  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={delay ? { delay: delay / 1000 } : undefined}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ children, className = "" }) {
  const prefersReduced = useReducedMotion();
  const variants = reducedVariants(prefersReduced, fadeUp);

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}