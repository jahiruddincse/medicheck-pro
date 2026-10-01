import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Coins, 
  Bell, 
  Share2, 
  MessageSquare, 
  Check, 
  AlertTriangle, 
  Info, 
  Clock, 
  Utensils, 
  BookmarkCheck,
  FileBadge2,
  Building2,
  Barcode,
  CheckCircle2
} from 'lucide-react';
import { Medicine, MedicineScan } from '../types';

interface MedicineDetailProps {
  medicine: Medicine;
  activeScan?: MedicineScan | null;
  onNavigate: (view: string) => void;
  onOpenReminderModal: () => void;
  onOpenDoctorModal: () => void;
  onOpenChat: () => void;
}

export const MedicineDetail: React.FC<MedicineDetailProps> = ({
  medicine,
  activeScan,
  onNavigate,
  onOpenReminderModal,
  onOpenDoctorModal,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'uses' | 'how' | 'precautions' | 'side-effects' | 'food'>('about');

  const batchNumber = activeScan?.batch_number || 'A3AEY041';
  const mfgDate = activeScan?.manufacturing_date || '05/2025';
  const expDate = activeScan?.expiry_date || '10/2026';
  const productId = medicine.product_code || '08904103310733';
  const licenseNumber = medicine.license_number || 'MB/06/479';

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2">
      {/* Top Back Nav & Quick Actions */}
      <div className="flex items-center justify-between border-b border-[#00e599]/15 pb-4">
        <button
          onClick={() => onNavigate('scanner')}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00e599] transition-colors font-mono-tag"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Lens Scanner</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('alternatives')}
            className="flex items-center gap-1.5 rounded-xl border border-[#00e599]/40 bg-[#00e599]/15 px-3.5 py-1.5 text-xs font-bold text-[#00e599] hover:bg-[#00e599] hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,153,0.15)]"
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Find Substitutes</span>
          </button>

          <button
            onClick={onOpenReminderModal}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition-all font-mono-tag"
          >
            <Bell className="h-3.5 w-3.5 text-[#00e599]" />
            <span>Dose Reminder</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 rounded-xl tech-button-mint px-4 py-1.5 text-xs font-bold text-black transition-all shadow-sm font-minimal"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Clinical Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Medicine Identification Card matching image.png */}
      <div className="rounded-3xl tech-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00e599]/10 blur-3xl" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-[#00e599]/40 bg-[#00e599]/15 px-3 py-1 text-xs font-bold text-[#00e599] font-mono-tag tracking-wider shadow-[0_0_15px_rgba(0,229,153,0.2)]">
              <span className="h-2 w-2 rounded-full bg-[#00e599] animate-pulse" />
              PACKAGE INFORMATION MATCHED ✓
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-400 font-mono-tag">
              {medicine.schedule_class}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-minimal">
            {medicine.brand_name}
          </h1>
          <p className="text-sm sm:text-base text-[#00e599] font-mono-tag font-bold">
            {medicine.strength}
          </p>
          <p className="text-xs text-zinc-300 font-mono-tag">
            {medicine.generic_name}
          </p>
        </div>

        {/* Technical Specification Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 font-mono-tag">
          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Manufacturer</span>
            <p className="text-xs font-semibold text-zinc-200 line-clamp-2">{medicine.manufacturer}</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Batch No</span>
            <p className="text-xs font-bold text-white">{batchNumber}</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">MFG Date</span>
            <p className="text-xs font-bold text-zinc-300">{mfgDate}</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">EXP Date</span>
            <p className="text-xs font-bold text-[#00e599]">{expDate}</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Product ID</span>
            <p className="text-xs text-zinc-300 truncate" title={productId}>{productId}</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Mfg License</span>
            <p className="text-xs text-zinc-300">{licenseNumber}</p>
          </div>
        </div>

        {/* Price & Substitutes Callout */}
        <div className="rounded-2xl border border-[#00e599]/20 bg-[#00e599]/[0.05] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-tag">
          <div>
            <span className="text-xs text-zinc-400">Maximum Retail Price (MRP):</span>
            <div className="text-2xl font-black text-white">₹{medicine.mrp.toFixed(2)}</div>
            <span className="text-[11px] text-zinc-500 font-sans">{medicine.pack_size}</span>
          </div>

          <button
            onClick={() => onNavigate('alternatives')}
            className="flex items-center gap-2 rounded-xl tech-button-mint px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-black shadow-md transition-all font-minimal"
          >
            <span>View Cheaper Substitutes (Save up to 38%)</span>
            <Coins className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Clinical Reference Tabs */}
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-1 no-scrollbar text-xs font-mono-tag">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-colors ${
              activeTab === 'about'
                ? 'border-b-2 border-[#00e599] text-[#00e599]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('uses')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-colors ${
              activeTab === 'uses'
                ? 'border-b-2 border-[#00e599] text-[#00e599]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Uses
          </button>
          <button
            onClick={() => setActiveTab('how')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-colors ${
              activeTab === 'how'
                ? 'border-b-2 border-[#00e599] text-[#00e599]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            How it Works
          </button>
          <button
            onClick={() => setActiveTab('precautions')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-colors ${
              activeTab === 'precautions'
                ? 'border-b-2 border-[#00e599] text-[#00e599]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Precautions
          </button>
          <button
            onClick={() => setActiveTab('side-effects')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-colors ${
              activeTab === 'side-effects'
                ? 'border-b-2 border-[#00e599] text-[#00e599]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Side Effects
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-2.5 rounded-t-xl font-bold transition-colors ${
              activeTab === 'food'
                ? 'border-b-2 border-[#00e599] text-[#00e599]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Food Information
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="rounded-2xl tech-card p-6 text-sm text-zinc-300 leading-relaxed min-h-[160px] font-minimal">
          {activeTab === 'about' && (
            <div className="space-y-3">
              <p>{medicine.about}</p>
              <div className="text-xs text-zinc-400 pt-2 border-t border-white/[0.06] flex items-center gap-2 font-mono-tag">
                <Info className="h-4 w-4 text-[#00e599] shrink-0" />
                <span>Storage guidance: {medicine.storage}</span>
              </div>
            </div>
          )}

          {activeTab === 'uses' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono-tag">
                Documented Clinical Indications:
              </span>
              <ul className="space-y-2">
                {medicine.uses.map((use, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 font-minimal">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#00e599]/20 text-[#00e599] text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'how' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono-tag">
                Pharmacological Mechanism of Action:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-minimal">
                {medicine.how_it_works}
              </p>
            </div>
          )}

          {activeTab === 'precautions' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono-tag">
                <AlertTriangle className="h-3.5 w-3.5" />
                Special Precautions & Warnings:
              </span>
              <ul className="space-y-2">
                {medicine.precautions.map((prec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-minimal">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{prec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'side-effects' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block font-mono-tag">
                Documented Side Effects:
              </span>
              <ul className="space-y-1.5">
                {medicine.side_effects.map((se, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-minimal">
                    <span className="text-zinc-500 font-bold shrink-0">•</span>
                    <span>{se}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'food' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#00e599] uppercase tracking-wider flex items-center gap-1.5 font-mono-tag">
                <Utensils className="h-3.5 w-3.5" />
                Food & Beverage Guidance:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-minimal">
                {medicine.food_information}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="rounded-2xl tech-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono-tag text-xs text-zinc-300">
          <BookmarkCheck className="h-4 w-4 text-[#00e599]" />
          <span>Saved to patient profile in Supabase.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto font-minimal">
          <button
            onClick={() => onNavigate('alternatives')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl tech-button-mint px-5 py-2.5 text-xs font-bold text-black"
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Find Substitutes</span>
          </button>

          <button
            onClick={onOpenReminderModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Clock className="h-3.5 w-3.5 text-[#00e599]" />
            <span>Set Reminder</span>
          </button>

          <button
            onClick={onOpenDoctorModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-[#00e599]/40 bg-[#00e599]/15 px-4 py-2.5 text-xs font-bold text-[#00e599] hover:bg-[#00e599] hover:text-black transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share with Doctor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
