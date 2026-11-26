import React from "react";

interface HermesLogoProps {
  className?: string;
  size?: number;
}

export const HermesLogo: React.FC<HermesLogoProps> = ({ className = "w-10 h-10", size = 40 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Hermes Emblem"
    >
      {/* Outer subtle glow */}
      <div className="absolute inset-0 rounded-full bg-[#F36B35]/25 blur-sm" />

      {/* Outer border ring */}
      <div className="absolute inset-0 rounded-full border border-[#FFB347]/50 shadow-sm shadow-[#F36B35]/30" />

      {/* Image filling full circular frame */}
      <div className="relative w-full h-full rounded-full overflow-hidden">
        <img
          src="./hermes-bust.png"
          alt="Hermes Emblem"
          className="w-full h-full object-cover object-center scale-120"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#101010]/40 pointer-events-none" />
      </div>
    </div>
  );
};
