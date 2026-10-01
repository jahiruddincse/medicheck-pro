import React, { useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { MedicineScan, ShareToken } from '../types';
import { dbService } from '../lib/supabase';

interface DoctorShareModalProps {
  scans: MedicineScan[];
  onClose: () => void;
  onOpenDoctorView: () => void;
}

export const DoctorShareModal: React.FC<DoctorShareModalProps> = ({
  scans,
  onClose,
  onOpenDoctorView,
}) => {
  const [step, setStep] = useState<'config' | 'qr'>('config');

  // Configuration toggles
  const [includeHistory, setIncludeHistory] = useState<boolean>(true);
  const [includeVerification, setIncludeVerification] = useState<boolean>(true);
  const [includeCurrentDoses, setIncludeCurrentDoses] = useState<boolean>(true);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);

  // Generated token
  const [activeToken, setActiveToken] = useState<ShareToken | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(30);

  const handleGenerateQR = async () => {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const tokenCode = `MGX-7F92-${randomChars}`;

    const items = scans.slice(0, 5).map((s) => ({
      brand_name: s.detected_brand,
      dosage_form: s.medicine?.dosage_form || 'Tablet',
      strength: s.medicine?.strength || 'Standard',
      batch_number: s.batch_number,
      expiry_date: s.expiry_date,
      verified: s.verification_status === 'MATCHED',
      scan_date: s.scan_time,
      schedule_class: s.medicine?.schedule_class || 'Schedule H',
    }));

    const tokenObj: ShareToken = {
      id: `token-${Date.now()}`,
      user_id: 'patient-demo-01',
      token_code: tokenCode,
      patient_name: 'Aditya Verma (Patient #4082)',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
      duration_minutes: durationMinutes,
      include_history: includeHistory,
      include_verification: includeVerification,
      include_current_doses: includeCurrentDoses,
      revoked: false,
      items,
    };

    await dbService.createShareToken(tokenObj);
    setActiveToken(tokenObj);
    setMinutesRemaining(durationMinutes);

    // Generate real QR code image
    const shareUrl = `${window.location.origin}/doctor?token=${tokenCode}`;
    try {
      const dataUrl = await QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
    }

    setStep('qr');
  };

  const handleCopyCode = () => {
    if (!activeToken) return;
    navigator.clipboard.writeText(activeToken.token_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRevoke = () => {
    if (activeToken) {
      activeToken.revoked = true;
      dbService.createShareToken({ ...activeToken, revoked: true });
    }
    setStep('config');
    setActiveToken(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-lg rounded-3xl tech-card p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden space-y-6 font-minimal">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00e599]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00e599] text-black shadow-[0_0_15px_rgba(0,229,153,0.3)]">
              <QrCode className="h-5 w-5 stroke-[2.4]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {step === 'config' ? 'Share Medicine History' : 'Temporary Doctor Access'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono-tag">
                {step === 'config' ? 'Time-limited read-only patient QR' : 'Active Clinician Access Session'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: Select Information & Duration */}
        {step === 'config' && (
          <div className="space-y-5 text-xs">
            <p className="text-zinc-300 leading-relaxed font-normal">
              Select which clinical records to disclose. The attending physician can scan this QR code with any standard smartphone camera without installing an app.
            </p>

            {/* Checklist */}
            <div className="space-y-2.5 rounded-2xl border border-white/[0.08] bg-black/40 p-4 font-mono-tag">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-sans">
                Select Disclosed Fields:
              </span>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHistory}
                  onChange={(e) => setIncludeHistory(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#00e599]"
                />
                <span className="text-zinc-200">Medicine history ({scans.length} verified scans)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVerification}
                  onChange={(e) => setIncludeVerification(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#00e599]"
                />
                <span className="text-zinc-200">Batch verification and authenticity receipts</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCurrentDoses}
                  onChange={(e) => setIncludeCurrentDoses(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#00e599]"
                />
                <span className="text-zinc-200">Current active medication schedules</span>
              </label>

              <label className="flex items-center gap-3 opacity-50 cursor-not-allowed">
                <input type="checkbox" disabled checked={false} className="h-4 w-4 rounded" />
                <span className="text-zinc-500">Personal private billing information (Hidden)</span>
              </label>
            </div>

            {/* Duration selector */}
            <div className="space-y-1.5 font-mono-tag">
              <label className="block text-zinc-300 font-semibold font-minimal">Access Duration:</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-white text-xs focus:border-[#00e599] focus:outline-none"
              >
                <option value={15}>15 minutes (Quick Consultation)</option>
                <option value={30}>30 minutes (Standard OPD Visit)</option>
                <option value={60}>1 hour (Detailed Clinical Review)</option>
                <option value={1440}>24 hours (Emergency Admission)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 font-minimal">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQR}
                className="flex items-center gap-2 rounded-xl tech-button-mint px-6 py-2.5 text-xs font-bold text-black transition-all shadow-md active:scale-95"
              >
                <QrCode className="h-4 w-4" />
                <span>Generate QR Code</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Scannable QR Stage */}
        {step === 'qr' && activeToken && (
          <div className="space-y-5 text-center font-minimal">
            <div className="space-y-1">
              <span className="text-xs font-mono-tag text-[#00e599] uppercase tracking-widest block font-bold">
                PHYSICIAN READ-ONLY ACCESS
              </span>
              <h4 className="text-2xl font-black text-white tracking-tight">
                Scan with any smartphone camera.
              </h4>
            </div>

            {/* QR Card */}
            <div className="mx-auto w-64 rounded-3xl bg-white p-4 shadow-[0_10px_40px_rgba(0,229,153,0.3)]">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Doctor History QR Code"
                  className="w-full h-auto rounded-xl object-contain mx-auto"
                />
              )}
            </div>

            {/* Access Token Code */}
            <div className="inline-flex items-center gap-3 rounded-xl border border-[#00e599]/30 bg-black/50 px-4 py-2 text-xs font-mono-tag">
              <span className="text-zinc-500">CODE:</span>
              <strong className="text-base text-[#00e599] tracking-wider font-bold">
                {activeToken.token_code}
              </strong>
              <button
                onClick={handleCopyCode}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Copy Token"
              >
                {copied ? <Check className="h-4 w-4 text-[#00e599]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Expiry Countdown */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-mono-tag">
              <Clock className="h-3.5 w-3.5" />
              <span>Expires in ~{minutesRemaining} minutes</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-white/[0.08]">
              {/* Doctor View Simulation */}
              <button
                onClick={() => {
                  onClose();
                  onOpenDoctorView();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl tech-button-mint px-5 py-2.5 text-xs font-extrabold text-black transition-all"
              >
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Open Doctor View (Phone B)</span>
                <ExternalLink className="h-3 w-3" />
              </button>

              <button
                onClick={handleRevoke}
                className="w-full sm:w-auto rounded-xl border border-rose-500/40 bg-rose-950/20 px-5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors"
              >
                Revoke Access
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
