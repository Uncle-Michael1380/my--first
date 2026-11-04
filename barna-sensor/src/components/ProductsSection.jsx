import { motion } from "framer-motion";

const items = [
  { title: "سنسور قبل کاتالیست", text: "تنظیم نسبت سوخت و هوا؛ رایج‌ترین قطعه برای چراغ چک." },
  { title: "سنسور بعد کاتالیست", text: "پایش راندمان کاتالیست و کاهش خطای P0420." },
  { title: "سنسور پهن‌باند", text: "اندازه‌گیری دقیق λ برای خودروهای انژکتوری جدید." },
];

export default function ProductsSection() {
  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="relative z-20 -mt-px rounded-t-[2rem] border-t border-signal/20 bg-steel px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="products-title" className="font-display text-3xl font-black md:text-5xl">
          سنسور مناسب خودرو را پیدا کنید
        </h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.li
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
              className="rounded-2xl border border-signal/15 bg-ink/60 p-7"
            >
              <h3 className="font-display text-xl font-bold text-signal">{it.title}</h3>
              <p className="mt-3 leading-8 text-text/80">{it.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
