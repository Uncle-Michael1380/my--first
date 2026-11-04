import { useEffect, useRef } from "react";

/**
 * Canvas field of O₂ molecules (two bonded atoms) drifting upward like gas
 * bubbles. A fine pointer pushes nearby molecules away.
 *
 * Performance: single canvas, DPR capped, no per-frame allocations, paused
 * when off-screen or the tab is hidden. With reduced motion it paints once.
 */
export default function ParticleField({
  mobile = false,
  reducedMotion = false,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const interactive = finePointer && !mobile && !reducedMotion;

    let w = 0;
    let h = 0;
    let parts = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };
    const RADIUS = 150;

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.12 + Math.random() * 0.3), // drift up
      ox: 0, // pointer displacement (eased back to 0)
      oy: 0,
      r: 2 + Math.random() * 2.2,
      a: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.01,
      alpha: 0.25 + Math.random() * 0.5,
      hot: Math.random() < 0.12, // a few amber molecules
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(mobile ? 26 : 90, Math.round((w * h) / (mobile ? 20000 : 14000)));
      parts = Array.from({ length: count }, make);
      if (!running) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const px = p.x + p.ox;
        const py = p.y + p.oy;
        const dx = Math.cos(p.a) * p.r * 1.1;
        const dy = Math.sin(p.a) * p.r * 1.1;
        const color = p.hot ? "255,181,71" : "60,224,200";
        ctx.strokeStyle = `rgba(${color},${p.alpha * 0.7})`;
        ctx.lineWidth = p.r * 0.45;
        ctx.beginPath(); // bond
        ctx.moveTo(px - dx, py - dy);
        ctx.lineTo(px + dx, py + dy);
        ctx.stroke();
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.beginPath(); // two atoms
        ctx.arc(px - dx, py - dy, p.r, 0, 6.2832);
        ctx.arc(px + dx, py + dy, p.r, 0, 6.2832);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        if (interactive) {
          const dx = p.x + p.ox - pointer.x;
          const dy = p.y + p.oy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS * RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / RADIUS) * 3.2;
            p.ox += (dx / d) * f;
            p.oy += (dy / d) * f;
          }
          p.ox *= 0.94; // ease back
          p.oy *= 0.94;
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reducedMotion || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = pointer.y = -9999; };
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
    if (interactive) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [mobile, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
