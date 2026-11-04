import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "../lib/gsap.js";
import { useIsMobile, usePrefersReducedMotion } from "../hooks/useMediaQuery.js";
import HeadlineReveal from "./HeadlineReveal.jsx";
import MagneticButton from "./MagneticButton.jsx";
import ParticleField from "./ParticleField.jsx";
import LazyVideo from "./LazyVideo.jsx";
import SensorIllustration from "./SensorIllustration.jsx";
import heroVideo from "../assets/hero-loop.mp4";
import heroPoster from "../assets/hero-poster.jpg";

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export default function Hero() {
  const root = useRef(null);
  const bg = useRef(null);
  const content = useRef(null);
  const glow = useRef(null);
  const sensor = useRef(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // ── Desktop: pin for 100vh, parallax 0.3x, content fades into next section
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const st = { trigger: root.current, start: "top top", end: "+=100%", scrub: true, invalidateOnRefresh: true };

      gsap.to(bg.current, {
        y: () => window.innerHeight * 0.3, // 0.3x of the scroll distance
        ease: "none",
        scrollTrigger: { ...st, pin: true, anticipatePin: 1 },
      });
      gsap.to(content.current, {
        yPercent: -12,
        opacity: 0,
        ease: "power1.in",
        scrollTrigger: { ...st, start: "top+=35% top", end: "+=65%" },
      });

      // Mouse reaction: glow follows the cursor, sensor drifts opposite for depth.
      if (window.matchMedia("(pointer: fine)").matches) {
        const gx = gsap.quickTo(glow.current, "x", { duration: 0.6, ease: "power3" });
        const gy = gsap.quickTo(glow.current, "y", { duration: 0.6, ease: "power3" });
        const sx = gsap.quickTo(sensor.current, "x", { duration: 0.9, ease: "power3" });
        const sy = gsap.quickTo(sensor.current, "y", { duration: 0.9, ease: "power3" });
        const onMove = (e) => {
          gx(e.clientX);
          gy(e.clientY);
          sx((e.clientX / window.innerWidth - 0.5) * -28);
          sy((e.clientY / window.innerHeight - 0.5) * -18);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
    });

    // ── Mobile: no pin, softer 0.15x parallax, no cursor effects
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(bg.current, {
        y: () => root.current.offsetHeight * 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate h-svh min-h-[600px] overflow-hidden bg-ink"
    >
      {/* Background layer (parallax target). Extra height on top absorbs the shift. */}
      <div ref={bg} className="absolute inset-x-0 bottom-0 -top-[35svh] will-change-transform" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#12262d_0%,#0a1418_70%)]" />
        <div className="dot-grid absolute inset-0" />
        {!mobile && !reduced && (
          <LazyVideo
            src={heroVideo}
            poster={heroPoster}
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
          />
        )}
        <ParticleField mobile={mobile} reducedMotion={reduced} className="absolute inset-0" />
      </div>

      {/* Cursor glow (desktop, fine pointer only) */}
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none absolute start-0 top-0 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-3xl md:block"
        style={{ transform: "translate(-9999px,-9999px)" }}
      />

      {/* Mobile: sensor as a faint background figure */}
      <SensorIllustration
        showReadout={false}
        className="pointer-events-none absolute -bottom-6 -start-10 h-[58%] opacity-25 md:hidden"
      />

      <div ref={content} className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 pt-20 md:px-8">
        <div className="grid w-full items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          {/* Text column: DOM-first so it sits on the right in RTL */}
          <div className="text-start">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-steel/70 px-3.5 py-1.5 text-xs text-signal md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              فروشگاه تخصصی سنسور اکسیژن
            </motion.p>

            <HeadlineReveal
              id="hero-title"
              lines={["سنسور اکسیژن اصل،", "عیب‌یابی بدون حدس"]}
              className="font-display text-[2.35rem] font-black leading-[1.35] sm:text-5xl lg:text-7xl lg:leading-[1.3]"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
              className="mt-6 max-w-xl text-[0.95rem] leading-8 text-text/85 md:text-lg"
            >
              لامبدا با گارانتی کتبی و ارسال سریع برای تعمیرکاران
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <MagneticButton href="#products" variant="primary" magnetic={!mobile && !reduced} className="w-full sm:w-auto">
                مشاهده سنسورها <ArrowLeft />
              </MagneticButton>
              <MagneticButton href="#guide" variant="secondary" magnetic={!mobile && !reduced} className="w-full sm:w-auto">
                راهنمای انتخاب سنسور
              </MagneticButton>
            </motion.div>
          </div>

          {/* Visual column (desktop) */}
          <div className="hidden justify-center md:flex">
            <div ref={sensor} className="h-[min(62svh,520px)] will-change-transform">
              <SensorIllustration className="relative h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
