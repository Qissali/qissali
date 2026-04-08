"use client";

import { CommanderModalTrigger } from "@/components/Modal";

export default function UniversTile({ emoji, titre }) {
  return (
    <CommanderModalTrigger
      aria-label={`Commander une histoire — ${titre}`}
      className="w-full border-0 bg-transparent p-0 text-left"
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          background: "var(--bg-section)",
          border: "1px solid var(--rose-light)",
          borderRadius: "20px",
          padding: "36px 16px",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--rose-pale)";
          e.currentTarget.style.borderColor = "var(--rose)";
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,160,192,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-section)";
          e.currentTarget.style.borderColor = "var(--rose-light)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }} aria-hidden>
          {emoji}
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            color: "var(--text-title)",
          }}
        >
          {titre}
        </h3>
      </div>
    </CommanderModalTrigger>
  );
}
