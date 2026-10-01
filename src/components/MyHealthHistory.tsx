import React from 'react';
import { 
  History, 
  CheckCircle2, 
  Share2, 
  Pill, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { MedicineScan } from '../types';

interface MyHealthHistoryProps {
  scans: MedicineScan[];
  onSelectScan: (scan: MedicineScan) => void;
  onOpenDoctorModal: () => void;
  onOpenScanner: () => void;
}

export const MyHealthHistory: React.FC<MyHealthHistoryProps> = ({
  scans,
  onSelectScan,
  onOpenDoctorModal,
  onOpenScanner,
}) => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2 font-minimal">
      {/* Header Banner */}
      <div className="rounded-3xl tech-card p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#00e599]/15 blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00e599]/30 bg-[#00e599]/10 px-3.5 py-1 text-xs text-[#00e599] font-mono-tag">
              <History className="h-3.5 w-3.5" />
              <span>Verified Health Record · Supabase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-minimal">
              Patient <span className="text-[#00e599]">History</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md">
              Your verified medicine scans, active dosages, and packaging authenticity receipts.
            </p>
          </div>

          <button
            onClick={onOpenDoctorModal}
            className="flex items-center gap-2 rounded-xl tech-button-mint px-6 py-3 text-xs font-extrabold text-black shadow-lg transition-all self-start sm:self-auto active:scale-95"
          >
            <QrCode className="h-4 w-4" />
            <span>Doctor Share QR</span>
          </button>
        </div>
      </div>

      {/* Scanned Medicines Timeline */}
      <div className="space-y-3 font-mono-tag">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>DOCUMENTED MEDICINE HISTORY ({scans.length})</span>
          <span>AUTHENTICATION RECEIPT</span>
        </div>

        <div className="space-y-2.5">
          {scans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="group cursor-pointer rounded-2xl tech-card p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00e599]/20 text-[#00e599] text-xs font-bold">
                    ✓
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-[#00e599] transition-colors font-minimal">
                    {scan.detected_brand}
                  </h3>
                  <span className="rounded bg-[#00e599]/20 px-2 py-0.2 text-[9px] font-mono-tag font-bold text-[#00e599] border border-[#00e599]/30">
                    MATCHED
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-mono-tag">
                  {scan.medicine?.composition || scan.medicine?.strength || 'Verified formulation'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 font-mono-tag pt-1">
                  <span>Batch: <strong className="text-zinc-200">{scan.batch_number}</strong></span>
                  <span>·</span>
                  <span>EXP: <strong className="text-zinc-200">{scan.expiry_date}</strong></span>
                  <span>·</span>
                  <span>Scanned: {scan.scan_time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-minimal">
                <span className="hidden sm:inline text-xs text-zinc-400 group-hover:text-[#00e599] transition-colors">
                  View Intel
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-[#00e599] transition-colors" />
              </div>
            </div>
          ))}

          {scans.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/40 p-12 text-center space-y-3">
              <Pill className="h-8 w-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">No scanned medicines in history yet.</p>
              <button
                onClick={onOpenScanner}
                className="rounded-xl tech-button-mint px-5 py-2.5 text-xs font-bold text-black"
              >
                Scan a Medicine
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
