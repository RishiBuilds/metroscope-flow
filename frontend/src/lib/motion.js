export const EASE = [0.25, 0.1, 0.25, 1];

export const EASE_OUT = [0.16, 1, 0.3, 1];

export const T_DEFAULT = { duration: 0.4, ease: EASE };
export const T_FAST    = { duration: 0.2, ease: EASE };
export const T_EXIT    = { duration: 0.15, ease: EASE };

export const SPRING_POP = { type: 'spring', stiffness: 300, damping: 15 };

export const SPRING_CARD = { type: 'spring', stiffness: 400, damping: 28 };

export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: T_DEFAULT },
  exit:    { opacity: 0, y: 8, transition: T_EXIT },
};

export const fadePlain = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: T_FAST },
  exit:    { opacity: 0, transition: T_EXIT },
};

export const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerFast = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

export function reducedTransition(prefersReduced, normalTransition) {
  if (prefersReduced) return { duration: 0.01 };
  return normalTransition;
}

export function reducedVariants(prefersReduced, normalVariants) {
  if (!prefersReduced) return normalVariants;
  return {
    hidden:  { opacity: 1, y: 0, scale: 1, x: 0 },
    visible: { opacity: 1, y: 0, scale: 1, x: 0, transition: { duration: 0.01 } },
    exit:    { opacity: 1, y: 0, scale: 1, x: 0, transition: { duration: 0.01 } },
  };
}
