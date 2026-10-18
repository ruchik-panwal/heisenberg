"use client";

import { useHoverAnimation } from "../animations/useHoverAnimation"; // Adjust the import path if needed

export default function CompoundItem({ compound, onClick }) {
  const { containerRef, hoverBgRef, toggleHover } = useHoverAnimation();

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => toggleHover(true)}
      onMouseLeave={() => toggleHover(false)}
      className="group relative overflow-hidden border-b border-[#969696] px-6 py-2 flex justify-between items-center cursor-pointer"
    >
      {/* Animated Hover Background - Bottom to Top */}
      <div
        ref={hoverBgRef}
        className="absolute bottom-0 left-0 w-full h-0 z-0 bg-white pointer-events-none"
      />

      {/* Content wrapper with mix-blend-exclusion so text inverts on white background */}
      <div className="w-full flex justify-between items-center mix-blend-exclusion z-10">
        <div className="text-4xl text-white/90 capitalize">{compound}</div>
        <div className="opacity-0 group-hover:opacity-100 text-white flex items-center text-sm transition-opacity">
          View details
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}