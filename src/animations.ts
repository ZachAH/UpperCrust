import { circOut } from "framer-motion";

export const popIn = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: circOut, // ✔ Framer’s typed easing
    },
  },
};

export const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // Medium rhythm
        delayChildren: 0.05,
      },
    },
  };
  