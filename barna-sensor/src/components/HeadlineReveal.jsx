import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } }, // 80ms stagger
};

const line = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: "easeOut" } },
};

/**
 * Reveals each entry of `lines` one after another (80ms stagger, ease-out).
 * Each line sits in an overflow mask so it slides up from behind its own baseline.
 * The padding / negative margin keeps Persian ascenders & descenders unclipped.
 */
export default function HeadlineReveal({ id, lines, className = "" }) {
  return (
    <motion.h1
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {lines.map((text, i) => (
        <span key={i} className="block overflow-hidden py-[0.12em] -my-[0.12em]">
          <motion.span
            variants={line}
            className={`block will-change-transform ${
              i === lines.length - 1 ? "text-signal" : ""
            }`}
          >
            {text}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
