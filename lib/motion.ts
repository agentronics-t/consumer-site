export const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  micro: 0.15,
  small: 0.3,
  medium: 0.6,
  large: 0.9,
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: DURATION.medium, ease: EASE_BRAND },
};

export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});
