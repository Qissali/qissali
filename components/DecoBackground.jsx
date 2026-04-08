export default function DecoBackground({ variant }) {
  const stars = [
    { x: "8%", y: "15%", size: 6, opacity: 0.4 },
    { x: "92%", y: "8%", size: 4, opacity: 0.3 },
    { x: "15%", y: "75%", size: 8, opacity: 0.25 },
    { x: "88%", y: "65%", size: 5, opacity: 0.35 },
    { x: "45%", y: "5%", size: 4, opacity: 0.2 },
    { x: "75%", y: "88%", size: 7, opacity: 0.3 },
    { x: "25%", y: "90%", size: 3, opacity: 0.25 },
    { x: "60%", y: "12%", size: 5, opacity: 0.3 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden
    >
      {stars.map((s, i) => (
        <svg
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            opacity: s.opacity,
          }}
          width={s.size * 2}
          height={s.size * 2}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
            fill="#E8A0C0"
          />
        </svg>
      ))}

      {(variant === "hero" || variant === "dark") && (
        <svg
          style={{
            position: "absolute",
            right: "5%",
            top: "10%",
            opacity: 0.15,
          }}
          width="120"
          height="120"
          viewBox="0 0 100 100"
        >
          <path
            d="M70 50c0 22-18 40-40 40 C13 90 2 74 2 57c13 8 28 8 40 0 12-8 20-22 20-38 5 8 8 19 8 31z"
            fill="#C49AD8"
          />
        </svg>
      )}

      {variant === "hero" && (
        <svg
          style={{
            position: "absolute",
            left: "3%",
            bottom: "15%",
            opacity: 0.1,
          }}
          width="60"
          height="60"
          viewBox="0 0 100 100"
        >
          <path
            d="M70 50c0 22-18 40-40 40 C13 90 2 74 2 57c13 8 28 8 40 0 12-8 20-22 20-38 5 8 8 19 8 31z"
            fill="#C49AD8"
          />
        </svg>
      )}

      {(variant === "hero" || variant === "light") && (
        <svg
          style={{
            position: "absolute",
            right: "2%",
            bottom: "20%",
            opacity: variant === "hero" ? 0.12 : 0.08,
          }}
          width="60"
          height="80"
          viewBox="0 0 60 80"
        >
          <line x1="30" y1="0" x2="30" y2="10" stroke="#E8A0C0" strokeWidth="2" />
          <ellipse cx="30" cy="12" rx="8" ry="4" fill="none" stroke="#E8A0C0" strokeWidth="1.5" />
          <path
            d="M15 20 Q10 45 15 60 L45 60 Q50 45 45 20 Z"
            fill="none"
            stroke="#E8A0C0"
            strokeWidth="1.5"
          />
          <line x1="20" y1="20" x2="17" y2="60" stroke="#E8A0C0" strokeWidth="0.8" opacity="0.6" />
          <line x1="30" y1="20" x2="30" y2="60" stroke="#E8A0C0" strokeWidth="0.8" opacity="0.6" />
          <line x1="40" y1="20" x2="43" y2="60" stroke="#E8A0C0" strokeWidth="0.8" opacity="0.6" />
          <path
            d="M12 60 L15 68 L45 68 L48 60 Z"
            fill="none"
            stroke="#E8A0C0"
            strokeWidth="1.5"
          />
          <ellipse cx="30" cy="42" rx="6" ry="8" fill="#E8A0C0" opacity="0.15" />
        </svg>
      )}

      {variant === "hero" && (
        <svg
          style={{
            position: "absolute",
            left: "2%",
            top: "25%",
            opacity: 0.1,
            transform: "scale(0.7)",
          }}
          width="60"
          height="80"
          viewBox="0 0 60 80"
        >
          <line x1="30" y1="0" x2="30" y2="10" stroke="#C49AD8" strokeWidth="2" />
          <ellipse cx="30" cy="12" rx="8" ry="4" fill="none" stroke="#C49AD8" strokeWidth="1.5" />
          <path
            d="M15 20 Q10 45 15 60 L45 60 Q50 45 45 20 Z"
            fill="none"
            stroke="#C49AD8"
            strokeWidth="1.5"
          />
          <line x1="30" y1="20" x2="30" y2="60" stroke="#C49AD8" strokeWidth="0.8" opacity="0.6" />
          <path
            d="M12 60 L15 68 L45 68 L48 60 Z"
            fill="none"
            stroke="#C49AD8"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {variant === "light" && (
        <svg
          style={{
            position: "absolute",
            right: "10%",
            top: "5%",
            opacity: 0.07,
          }}
          width="120"
          height="60"
          viewBox="0 0 120 60"
        >
          <ellipse cx="60" cy="40" rx="55" ry="20" fill="#C49AD8" />
          <ellipse cx="35" cy="32" rx="28" ry="22" fill="#C49AD8" />
          <ellipse cx="75" cy="28" rx="32" ry="24" fill="#C49AD8" />
          <ellipse cx="55" cy="24" rx="22" ry="18" fill="#C49AD8" />
        </svg>
      )}

      {[
        { x: "20%", y: "30%", r: 3 },
        { x: "80%", y: "40%", r: 2 },
        { x: "50%", y: "80%", r: 4 },
        { x: "10%", y: "55%", r: 2 },
        { x: "90%", y: "75%", r: 3 },
      ].map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: dot.r * 2,
            height: dot.r * 2,
            borderRadius: "50%",
            background: "var(--rose)",
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  );
}
