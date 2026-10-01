import React from 'react';
import { 
  Scan, 
  Pill, 
  Coins, 
  Bell, 
  QrCode, 
  History, 
  Stethoscope,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenDoctorModal: () => void;
  onOpenDoctorView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenDoctorModal,
  onOpenDoctorView,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#00e599]/15 bg-[#040906]/90 backdrop-blur-2xl transition-all">
      {/* Top Architecture Bar - 5-Second Glance friendly */}
      <div className="border-b border-[#00e599]/10 bg-[#00e599]/[0.03] px-4 py-1.5 text-[11px] text-zinc-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 font-mono-tag">
            <span className="flex h-2 w-2 rounded-full bg-[#00e599] animate-pulse" />
            <span className="text-zinc-200 font-semibold tracking-wide">SYSTEM:</span>
            <span className="text-[#00e599]">YOLOv8 Vision Anchor</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">Neural OCR & Extraction</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">Supabase Cloud</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDoctorView}
              className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-[#00e599] transition-colors font-mono-tag"
              title="Open Doctor's View (Phone B)"
            >
              <Stethoscope className="h-3 w-3 text-[#00e599]" />
              <span>Doctor Portal (Phone B)</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <button
          onClick={() => setCurrentView('scanner')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00e599] text-black shadow-[0_0_20px_rgba(0,229,153,0.35)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white font-minimal">
                Medi<span className="text-[#00e599]">Check</span>
              </span>
              <span className="text-[10px] text-[#00e599] font-mono-tag border border-[#00e599]/30 rounded px-1.5 py-0.2 bg-[#00e599]/10">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 line-clamp-1 font-mono-tag">
              AUTHENTICATE · VERIFY · SUBSTITUTE
            </p>
          </div>
        </button>

        {/* Center Nav tabs matching image.png style */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setCurrentView('scanner')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'scanner'
                ? 'bg-[#00e599] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scan className="h-3.5 w-3.5" />
            <span>Scan Lens</span>
          </button>

          <button
            onClick={() => setCurrentView('medicine-detail')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'medicine-detail'
                ? 'bg-[#00e599] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Pill className="h-3.5 w-3.5" />
            <span>Medicine Intel</span>
          </button>

          <button
            onClick={() => setCurrentView('alternatives')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'alternatives'
                ? 'bg-[#00e599] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Substitutes</span>
          </button>

          <button
            onClick={() => setCurrentView('reminders')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'reminders'
                ? 'bg-[#00e599] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Dose Reminder</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentView === 'history'
                ? 'bg-[#00e599] text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Patient History</span>
          </button>
        </nav>

        {/* Right Action: Share with Doctor */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDoctorModal}
            className="flex items-center gap-1.5 rounded-xl border border-[#00e599]/40 bg-[#00e599]/15 px-3.5 py-2 text-xs font-bold text-[#00e599] hover:bg-[#00e599] hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,153,0.15)] active:scale-95"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Doctor Share QR</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="flex md:hidden items-center justify-around border-t border-white/[0.05] px-2 py-2 text-xs font-mono-tag">
        <button
          onClick={() => setCurrentView('scanner')}
          className={`px-2 py-1 ${currentView === 'scanner' ? 'text-[#00e599] font-bold' : 'text-zinc-400'}`}
        >
          Scan Lens
        </button>
        <button
          onClick={() => setCurrentView('medicine-detail')}
          className={`px-2 py-1 ${currentView === 'medicine-detail' ? 'text-[#00e599] font-bold' : 'text-zinc-400'}`}
        >
          Intel
        </button>
        <button
          onClick={() => setCurrentView('alternatives')}
          className={`px-2 py-1 ${currentView === 'alternatives' ? 'text-[#00e599] font-bold' : 'text-zinc-400'}`}
        >
          Substitutes
        </button>
        <button
          onClick={() => setCurrentView('reminders')}
          className={`px-2 py-1 ${currentView === 'reminders' ? 'text-[#00e599] font-bold' : 'text-zinc-400'}`}
        >
          Dose
        </button>
        <button
          onClick={() => setCurrentView('history')}
          className={`px-2 py-1 ${currentView === 'history' ? 'text-[#00e599] font-bold' : 'text-zinc-400'}`}
        >
          History
        </button>
      </div>
    </header>
  );
};
