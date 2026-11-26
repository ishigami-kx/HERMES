import React from "react";
import { Zap, Globe, GraduationCap, Heart } from "lucide-react";

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-[#F36B35]" />,
      title: "Real-Time",
      subtitle: "Transcription",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#FFB347]" />,
      title: "Multi-Language",
      subtitle: "(English & Amharic)",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-[#FFB347]" />,
      title: "Accessible",
      subtitle: "Education",
    },
    {
      icon: <Heart className="w-5 h-5 text-[#F36B35]" />,
      title: "Inclusive",
      subtitle: "Learning",
    },
  ];

  return (
    <div
      aria-label="Product Features"
      className="w-full bg-[#181818]/90 backdrop-blur-md border border-[#282828] rounded-2xl p-4 sm:p-5 shadow-sm"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#262626]">
        {features.map((feat, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 ${
              index !== 0 ? "pt-3 md:pt-0 md:pl-5" : ""
            } group transition-all duration-200`}
          >
            <div className="p-2.5 rounded-xl bg-[#202020] border border-[#2E2E2E] group-hover:border-[#F36B35]/40 transition-colors shrink-0 shadow-xs">
              {feat.icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#F5F5F5] leading-tight group-hover:text-[#FFB347] transition-colors">
                {feat.title}
              </p>
              <p className="text-[11px] sm:text-xs text-[#A0A0A0] font-medium leading-tight mt-0.5">
                {feat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
