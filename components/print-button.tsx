"use client";

export default function PrintButton() {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <a
        href="/Chaitanya-Meshram-Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="button soft"
      >
        View PDF ↗
      </a>

      <a
        href="/Chaitanya-Meshram-Resume.pdf"
        download="Chaitanya-Meshram-Resume.pdf"
        className="button dark"
      >
        Download PDF ↓
      </a>
    </div>
  );
}