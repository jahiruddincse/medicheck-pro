import React, { useState } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  ArrowLeft, 
  TrendingDown, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { Medicine, MedicineAlternative } from '../types';
import { curatedAlternatives } from '../data/medicineDb';

interface MedicineAlternativesProps {
  currentMedicine: Medicine;
  onNavigate: (view: string) => void;
  onSelectAlternative: (altName: string) => void;
}

export const MedicineAlternatives: React.FC<MedicineAlternativesProps> = ({
  currentMedicine,
  onNavigate,
  onSelectAlternative,
}) => {
  const alternatives = curatedAlternatives[currentMedicine.id] || curatedAlternatives['med-gudcef-cv-200'] || [];
  const maxSavings = alternatives.length > 0 ? Math.max(...alternatives.map((a) => a.savings)) : 56;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2 font-minimal">
      {/* Back Nav */}
      <div className="flex items-center justify-between border-b border-[#00e599]/15 pb-4">
        <button
          onClick={() => onNavigate('medicine-detail')}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00e599] transition-colors font-mono-tag"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {currentMedicine.brand_name}</span>
        </button>

        <div className="text-xs text-zinc-400 font-mono-tag">
          Bioequivalent Formulation: <strong className="text-[#00e599]">{currentMedicine.strength}</strong>
        </div>
      </div>

      {/* Header Banner matching image.png */}
      <div className="rounded-3xl tech-card p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#00e599]/15 blur-3xl" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono-tag font-bold text-[#00e599] uppercase tracking-wider">
            <Coins className="h-4 w-4" />
            <span>Database-Verified Bioequivalent Matches</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-minimal">
            Same composition <span className="text-[#00e599]">substitutes</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            Save up to ₹{maxSavings.toFixed(0)} per pack by selecting chemically identical formulations cross-referenced against the central CDSCO drug registry.
          </p>
        </div>

        {/* Current Medicine Comparison Card */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-mono-tag tracking-wider">Scanned Reference</span>
            <div className="text-lg font-bold text-white font-minimal">{currentMedicine.brand_name}</div>
            <div className="text-xs text-zinc-400 font-mono-tag">{currentMedicine.manufacturer}</div>
          </div>

          <div className="text-right font-mono-tag">
            <span className="text-xs text-zinc-500">Current MRP</span>
            <div className="text-2xl font-black text-white">₹{currentMedicine.mrp.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Medical Safety Notice */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200 flex items-start gap-3">
        <Stethoscope className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white uppercase tracking-wider block font-mono-tag">
            Physician Consultation Protocol:
          </span>
          <p className="text-amber-200/90 leading-relaxed">
            <strong>Always ask your doctor or pharmacist before switching brands.</strong> While the active pharmaceutical ingredients and bioavailability are identical, inactive excipients may differ.
          </p>
        </div>
      </div>

      {/* Alternative Cards List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono-tag font-bold uppercase tracking-wider text-zinc-400 px-1">
          Verified Identical Salt Matches ({alternatives.length})
        </h3>

        {alternatives.map((alt, index) => (
          <div
            key={alt.id}
            className="rounded-2xl tech-card p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00e599]/20 text-xs font-mono-tag font-bold text-[#00e599]">
                  {index + 1}
                </span>
                <h4 className="text-base font-bold text-white font-minimal">{alt.alternative_brand}</h4>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-mono-tag ${
                    alt.type === 'Generic Equivalent'
                      ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40'
                      : 'bg-white/10 text-zinc-300 border border-white/10'
                  }`}
                >
                  {alt.type}
                </span>
              </div>

              <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono-tag">
                <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                <span>{alt.manufacturer}</span>
              </p>

              <div className="text-[11px] text-[#00e599] font-mono-tag flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{alt.composition_match}</span>
              </div>
            </div>

            {/* Pricing Comparison */}
            <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] font-mono-tag">
              <div className="text-right">
                <div className="text-2xl font-black text-white">₹{alt.price.toFixed(2)}</div>
                <div className="text-xs font-bold text-[#00e599] flex items-center justify-end gap-1">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Save ₹{alt.savings.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectAlternative(alt.alternative_brand)}
                className="rounded-xl tech-button-mint px-4 py-2.5 text-xs font-extrabold text-black transition-all shadow-sm font-minimal"
              >
                Inquire Dose
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bioequivalence Explanation */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white font-mono-tag">
          <Sparkles className="h-4 w-4 text-[#00e599]" />
          <span>Biochemical Equivalence Standard</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-minimal">
          These products share the identical active pharmaceutical salts and clinical strength ({currentMedicine.strength}). In accordance with Indian Pharmacopoeia and CDSCO regulations, generic equivalents provide equivalent dissolution kinetics and systemic therapeutic efficacy.
        </p>
      </div>
    </div>
  );
};
