"use client";

import { useState } from "react";

export default function UniversTile({ emoji, titre }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        background: hover ? "var(--violet)" : "var(--lila-med)",
        border: "1px solid var(--lila-dark)",
        borderRadius: "20px",
        padding: "36px 16px",
        textAlign: "center",
        transition: "all 0.3s ease",
        cursor: "default",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ fontSize: "40px", marginBottom: "12px" }} aria-hidden>
        {emoji}
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "16px",
          color: hover ? "#FFFFFF" : "var(--violet-deep)",
          transition: "color 0.3s ease",
        }}
      >
        {titre}
      </h3>
    </div>
  );
}
