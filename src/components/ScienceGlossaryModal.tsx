import React, { useState } from "react";
import { SCIENCE_GLOSSARY, type ScienceTerm } from "../data/scienceGlossary";
import { BookOpen, Search, X } from "lucide-react";

interface ScienceGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScienceGlossaryModal: React.FC<ScienceGlossaryModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Mechanics", "Electricity & Magnetism", "Thermodynamics", "Waves & Optics", "General Science"];

  const filteredTerms = SCIENCE_GLOSSARY.filter((term: ScienceTerm) => {
    const matchesCat = selectedCategory === "All" || term.category === selectedCategory;
    const matchesQuery =
      term.en.toLowerCase().includes(search.toLowerCase()) ||
      term.am.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="relative w-full max-w-2xl bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#2E2E2E] p-5 sm:p-6 flex flex-col max-h-[85vh] text-[#F5F5F5]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#F36B35]/20 text-[#FFB347]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5]">
                  Physics & Science Terminology
                </h2>
                <p className="text-xs text-[#A0A0A0]">
                  የሳይንስ እና የፊዚክስ ቃላት መዝገብ (English ↔ አማርኛ Student Reference)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A0A0A0] hover:bg-[#282828] hover:text-[#F5F5F5] cursor-pointer"
              aria-label="Close Glossary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reference Disclaimer Notice */}
          <div className="mt-3 px-3 py-2 bg-[#202020] border border-[#2E2E2E] rounded-xl text-xs text-[#A0A0A0]">
            <strong className="text-[#FFB347]">Note:</strong> This is a student study glossary reference table. It does not alter speech recognition acoustic weights.
          </div>

          {/* Search & Filter */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#A0A0A0]" />
              <input
                type="text"
                placeholder="Search term (e.g. Gravity, ስበት, Velocity)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#2E2E2E] bg-[#141414] text-[#F5F5F5] placeholder-[#666666] focus:outline-hidden focus:ring-2 focus:ring-[#F36B35]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#2E2E2E] bg-[#141414] text-[#F5F5F5] cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#1A1A1A] text-[#F5F5F5]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Terms Grid */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#A0A0A0]">No matching science terms found.</div>
            ) : (
              filteredTerms.map((term, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#202020] border border-[#2E2E2E] hover:border-[#F36B35]/40 transition-colors"
                >
                  <div>
                    <span className="text-sm font-bold text-[#F5F5F5] block">{term.en}</span>
                    <span className="text-xs text-[#A0A0A0]">{term.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#FFB347] font-ethiopic block">
                      {term.am}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#2E2E2E] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-[#F36B35] to-[#FFB347] hover:brightness-110 text-black rounded-xl text-sm font-extrabold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
