import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

const links = [
  { href: "#products", label: "محصولات" },
  { href: "#guide", label: "راهنمای انتخاب" },
  { href: "#warranty", label: "گارانتی" },
  { href: "#contact", label: "تماس" },
];

function Logo({ small }) {
  return (
    <a href="#" className="flex items-center gap-2.5" aria-label="برنا سنسور — صفحه اصلی">
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="11" stroke="#3ce0c8" strokeWidth="3" strokeDasharray="56 14" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3.5" fill="#ffb547" />
      </svg>
      <motion.span
        animate={{ fontSize: small ? "1.1rem" : "1.35rem" }}
        className="font-display font-black text-text"
      >
        برنا سنسور
      </motion.span>
    </a>
  );
}

/** Sticky header: 88px → 60px, gains a blurred surface after 40px of scroll. */
export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={false}
      animate={{ height: scrolled ? 60 : 88 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open
          ? "bg-ink/90 shadow-[0_1px_0_rgb(60_224_200/0.18)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo small={scrolled} />

        <nav aria-label="منوی اصلی" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-text/85 transition-colors hover:text-signal">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="tel:+982100000000"
          className="hidden rounded-lg border border-signal/50 px-4 py-2 text-sm text-signal transition-colors hover:bg-signal hover:text-ink md:inline-block"
        >
          تماس با کارشناس
        </a>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="منوی موبایل"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-t border-signal/15 bg-ink/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col px-5 py-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-3.5 text-lg text-text">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
