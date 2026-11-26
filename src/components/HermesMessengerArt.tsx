import React from "react";

interface HermesMessengerArtProps {
  className?: string;
}

export const HermesMessengerArt: React.FC<HermesMessengerArtProps> = ({
  className = "w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56",
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Radiant Solar Flare Halo Backdrop */}
      <div className="absolute inset-0 rounded-full bg-radial from-[#F36B35]/40 via-[#FFB347]/20 to-transparent blur-2xl pointer-events-none scale-110" />

      {/* Decorative Golden Solar Aura Ring matching Reference Image 2 */}
      <div className="absolute inset-1 sm:inset-0 rounded-full border border-[#FFB347]/45 border-dashed pointer-events-none" />
      <div className="absolute inset-3 sm:inset-2 rounded-full border border-[#F36B35]/30 pointer-events-none" />

      {/* Hermes Bust Image filling the full circular frame smoothly */}
      <div className="relative w-[88%] h-[88%] rounded-full overflow-hidden shadow-2xl shadow-[#F36B35]/30 border border-[#FFB347]/30">
        <img
          src="./hermes-bust.png"
          alt="Hermes Classical Messenger"
          className="w-full h-full object-cover object-center scale-115 filter drop-shadow-[0_8px_20px_rgba(243,107,53,0.35)]"
          loading="eager"
        />

        {/* Ambient Warm Vignette & Solar Tone Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#101010]/10 to-[#101010]/60 pointer-events-none" />
      </div>
    </div>
  );
};
