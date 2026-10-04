import { Variants } from 'framer-motion';

// Easing presets typed as 4-element bezier tuples for Framer Motion compatibility
type CubicBezier = [number, number, number, number];

export const EASINGS: Record<string, CubicBezier> = {
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  luxurySmooth: [0.16, 1, 0.3, 1],
};

// Default transitions
export const TRANSITIONS = {
  smooth: {
    duration: 0.5,
    ease: EASINGS.luxurySmooth,
  },
  fast: {
    duration: 0.3,
    ease: EASINGS.luxurySmooth,
  },
  slow: {
    duration: 0.8,
    ease: EASINGS.luxurySmooth,
  },
  stagger: {
    staggerChildren: 0.08,
    delayChildren: 0.1,
  },
};

// Reusable Framer Motion Variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: TRANSITIONS.smooth,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: TRANSITIONS.smooth,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: TRANSITIONS.stagger,
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.smooth,
  },
};

export const cardHover: Variants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.3, ease: EASINGS.luxurySmooth },
  },
};

export const buttonHover: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -1,
    transition: { duration: 0.2, ease: EASINGS.luxurySmooth },
  },
  tap: { scale: 0.97 },
};
