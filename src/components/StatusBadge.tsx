import React from "react";
import type { RecognitionStatus } from "../types/speech";
import { Mic, Activity, CheckCircle2, AlertOctagon, StopCircle } from "lucide-react";

interface StatusBadgeProps {
  status: RecognitionStatus;
  message?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, message }) => {
  const configs: Record<
    RecognitionStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode; pulse: boolean }
  > = {
    ready: {
      label: "Ready to Listen",
      bg: "bg-emerald-950/40",
      text: "text-emerald-400",
      border: "border-emerald-800/80",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      pulse: false,
    },
    listening: {
      label: "Listening...",
      bg: "bg-[#F36B35]/15",
      text: "text-[#FFB347]",
      border: "border-[#F36B35]/50 ring-2 ring-[#F36B35]/30 animate-pulse",
      icon: <Mic className="w-4 h-4 animate-bounce text-[#FFB347]" />,
      pulse: true,
    },
    processing: {
      label: "Processing Speech",
      bg: "bg-[#FFB347]/15",
      text: "text-[#FFB347]",
      border: "border-[#FFB347]/50 ring-2 ring-[#FFB347]/30",
      icon: <Activity className="w-4 h-4 animate-spin text-[#FFB347]" />,
      pulse: false,
    },
    stopped: {
      label: "Stopped",
      bg: "bg-[#181818]",
      text: "text-[#A0A0A0]",
      border: "border-[#2E2E2E]",
      icon: <StopCircle className="w-4 h-4" />,
      pulse: false,
    },
    error: {
      label: "Error / Attention Needed",
      bg: "bg-red-950/60",
      text: "text-red-300",
      border: "border-red-800 ring-2 ring-red-600/40",
      icon: <AlertOctagon className="w-4 h-4 text-red-400" />,
      pulse: false,
    },
  };

  const current = configs[status];

  return (
    <div className="flex flex-col gap-1.5" role="status" aria-live="polite">
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold tracking-wide transition-all ${current.bg} ${current.text} ${current.border}`}
      >
        {current.icon}
        <span>{current.label}</span>
        {current.pulse && (
          <span className="relative flex h-2.5 w-2.5 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
          </span>
        )}
      </div>

      {message && status === "error" && (
        <div className="mt-1 px-3 py-2 bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 max-w-md">
          {message}
        </div>
      )}
    </div>
  );
};
