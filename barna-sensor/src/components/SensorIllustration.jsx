import { useId } from "react";

/**
 * Stylised lambda (O₂) sensor: wire, hex nut, threaded body and the slotted
 * protection tube. Purely decorative; the readout card gives it a live feel.
 */
export default function SensorIllustration({ className = "", showReadout = true }) {
  // Unique ids: two instances (desktop + mobile) must not share gradient ids,
  // otherwise the one inside a display:none subtree breaks the other.
  const uid = useId().replace(/:/g, "");
  const metal = `metal-${uid}`;
  const tip = `tip-${uid}`;
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 220 520" className="h-full w-auto drop-shadow-[0_20px_60px_rgba(60,224,200,0.18)]">
        <defs>
          <linearGradient id={metal} x1="0" x2="1">
            <stop offset="0" stopColor="#1b3a44" />
            <stop offset=".35" stopColor="#4f7683" />
            <stop offset=".55" stopColor="#9fc0c9" />
            <stop offset="1" stopColor="#1b3a44" />
          </linearGradient>
          <linearGradient id={tip} x1="0" x2="1">
            <stop offset="0" stopColor="#0f2a30" />
            <stop offset=".5" stopColor="#3ce0c8" stopOpacity=".85" />
            <stop offset="1" stopColor="#0f2a30" />
          </linearGradient>
        </defs>
        {/* cable */}
        <path d="M110 0 V70" stroke="#0e1b20" strokeWidth="16" strokeLinecap="round" />
        <path d="M105 0 V70" stroke="#2a4a54" strokeWidth="2" />
        {/* boot + body */}
        <rect x="84" y="62" width="52" height="86" rx="10" fill={`url(#${metal})`} />
        {/* hex nut */}
        <path d="M62 148 H158 L170 176 L158 204 H62 L50 176 Z" fill={`url(#${metal})`} stroke="#0a1418" strokeWidth="2" />
        <path d="M62 176 H158" stroke="#0a1418" strokeOpacity=".35" />
        {/* thread */}
        <rect x="80" y="204" width="60" height="78" fill={`url(#${metal})`} />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M80 ${212 + i * 9} H140`} stroke="#0a1418" strokeOpacity=".5" strokeWidth="2" />
        ))}
        {/* protection tube with slots */}
        <path d="M86 282 H134 V430 Q134 470 110 490 Q86 470 86 430 Z" fill={`url(#${tip})`} stroke="#0a1418" strokeWidth="2" />
        {[310, 340, 370, 400].map((y) => (
          <rect key={y} x="96" y={y} width="28" height="6" rx="3" fill="#0a1418" />
        ))}
      </svg>

      {showReadout && (
        <div className="absolute -start-6 bottom-16 w-48 rounded-xl border border-signal/30 bg-steel/80 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-text/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            خروجی سنسور (ولتاژ)
          </div>
          <svg viewBox="0 0 160 40" className="mt-2 w-full" fill="none">
            <path
              d="M0 28 C10 4 20 4 30 20 S50 36 60 12 S80 4 90 22 S110 36 120 10 S140 6 160 24"
              stroke="#3ce0c8"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              className="motion-safe:animate-[trace_3.2s_linear_infinite]"
            />
          </svg>
          <div className="mt-1 text-sm font-bold text-amber">۰٫۴۵ ولت · λ ≈ ۱</div>
        </div>
      )}
      <style>{`@keyframes trace{from{stroke-dashoffset:100}to{stroke-dashoffset:-100}}`}</style>
    </div>
  );
}
