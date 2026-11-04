import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const STRENGTH = 0.35; // fraction of cursor offset the button follows
const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

const styles = {
  primary:
    "bg-signal text-ink font-bold hover:shadow-[0_0_36px_-4px_rgb(60_224_200/0.65)] focus-visible:shadow-[0_0_36px_-4px_rgb(60_224_200/0.65)]",
  secondary:
    "border border-text/40 text-text font-medium hover:border-signal hover:text-signal hover:shadow-[0_0_28px_-6px_rgb(60_224_200/0.45)]",
};

/** Link-styled button that is gently pulled toward a fine pointer. */
export default function MagneticButton({
  href,
  children,
  variant = "primary",
  magnetic = true,
  className = "",
}) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const onMove = (e) => {
    if (!magnetic || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * STRENGTH);
    y.set((e.clientY - (r.top + r.height / 2)) * STRENGTH);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base transition-[box-shadow,border-color,color] duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
