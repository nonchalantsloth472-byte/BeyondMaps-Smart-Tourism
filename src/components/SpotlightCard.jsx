import { useRef } from "react";

/*
  Shared with Home.jsx's local implementation — extracted here so
  Dashboard, LocalExperiences and Safety can reuse the same subtle
  mouse-follow highlight on cards without duplicating it in three files.
*/

export default function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-500
          z-0
        "
        style={{
          background:
            "radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(198,106,74,0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
