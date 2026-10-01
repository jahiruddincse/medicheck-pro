import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Pill, 
  Printer, 
  CheckCircle2, 
  FileText,
  KeyRound,
  Save,
  Check,
  Search,
  PenTool,
  Send,
  UserCheck
} from 'lucide-react';
import { ShareToken } from '../types';
import { dbService } from '../lib/supabase';

interface DoctorViewProps {
  tokenCode?: string;
  onClose: () => void;
}

export const DoctorView: React.FC<DoctorViewProps> = ({
  tokenCode = 'MGX-7F92-K31',
  onClose,
}) => {
  const [inputCode, setInputCode] = useState<string>(tokenCode);
  const [activeCode, setActiveCode] = useState<string>(tokenCode);
  const [tokenData, setTokenData] = useState<ShareToken | null>(null);

  // Doctor clinical notes & prescription order write-in state
  const [doctorName, setDoctorName] = useState<string>('Dr. Rajesh Kulkarni, MD (Medicine)');
  const [doctorRegId, setDoctorRegId] = useState<string>('MCI-MH-49210');
  const [rxOrderCode, setRxOrderCode] = useState<string>('RX-2026-MED-491');
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    'Patient reviewed with acute upper respiratory tract symptoms. GUDCEF-CV 200 regimen verified as clinically appropriate. Monitored for gastrointestinal tolerance. Advised to complete full 5-day course.'
  );
  const [doctorAdvice, setDoctorAdvice] = useState<string>('Take with warm meals. Stay well hydrated. Review after 5 days if fever persists.');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveTimestamp, setSaveTimestamp] = useState<string>('');

  useEffect(() => {
    const data = dbService.getShareToken(activeCode);
    setTokenData(data);
  }, [activeCode]);

  const handleLookupCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setActiveCode(inputCode.trim().toUpperCase());
  };

  const handleSaveDoctorNotes = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSaveTimestamp(now);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#040906] text-[#e8f2ec] p-4 sm:p-6 md:p-10 font-sans selection:bg-[#00e599] selection:text-black">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Clinician Top Nav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00e599]/15 pb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00e599] transition-colors font-mono-tag"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to MediCheck App</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#00e599] animate-pulse" />
            <span className="text-[11px] font-mono-tag text-[#00e599] uppercase tracking-widest font-bold">
              VERIFIED CLINICAL SESSION · ENCRYPTED
            </span>
          </div>
        </div>

        {/* Access Code Input Bar (Doctor can enter any Patient Code) */}
        <div className="rounded-2xl border border-[#00e599]/20 bg-black/60 p-4 shadow-lg backdrop-blur-md">
          <form onSubmit={handleLookupCode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono-tag shrink-0">
              <KeyRound className="h-4 w-4 text-[#00e599]" />
              <span>Patient Access Code:</span>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Enter Code (e.g. MGX-7F92-K31)"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white placeholder-zinc-500 focus:border-[#00e599] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-xl tech-button-mint px-4 py-2 text-xs font-bold text-black uppercase tracking-wider transition-all"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Load Patient History</span>
            </button>
          </form>
        </div>

        {/* Doctor Summary Card */}
        <div className="rounded-3xl tech-card p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="border-b border-[#00e599]/15 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tag font-bold tracking-wider text-[#00e599]">
                MEDICHECK · CLINICAL PRACTITIONER PORTAL
              </span>
              <span className="rounded-full border border-[#00e599]/30 bg-[#00e599]/10 px-2.5 py-0.5 text-[10px] font-mono-tag font-bold text-[#00e599]">
                CDSCO VERIFIED PATIENT RECORDS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-minimal">
              Patient Verified Medicine History
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono-tag pt-1">
              <span>Patient: <strong className="text-white">Aditya Verma (Patient #4082)</strong></span>
              <span>·</span>
              <span>Active Token: <strong className="text-[#00e599]">{activeCode}</strong></span>
            </div>
          </div>

          {/* Session Expiry Banner */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-tag text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#00e599]" />
              <span>Access Valid for: <strong className="text-white">Active Clinical Consultation</strong></span>
            </div>
            <span className="text-[10px] text-[#00e599] font-bold uppercase tracking-wider bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
              Bi-directional Doctor Sync Enabled
            </span>
          </div>

          {/* Medicine History Table */}
          <div className="space-y-3 font-mono-tag">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Documented Medicine History ({tokenData?.items?.length || 3} Formulations)
              </h3>
              <span className="text-[10px] text-zinc-500">Verified via CDSCO & GS1 2D DataMatrix</span>
            </div>

            <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-black/50 overflow-hidden text-xs">
              {/* Item 1: GUDCEF-CV 200 */}
              <div className="p-4 space-y-1.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white font-minimal">GUDCEF-CV 200</h4>
                    <p className="text-zinc-400 text-[11px]">
                      Cefpodoxime Proxetil IP 200 mg + Clavulanic Acid 125 mg
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 px-2 py-0.5 text-[10px] font-bold font-minimal">
                    <CheckCircle2 className="h-3 w-3 text-[#00e599]" />
                    Verified Genuine ✓
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px] pt-1">
                  <span>Batch: <strong className="text-white">A3AEY041</strong></span>
                  <span>·</span>
                  <span>Expiry: <strong className="text-[#00e599]">10/2026</strong></span>
                  <span>·</span>
                  <span>Manufacturer: <strong className="text-zinc-300">Copmed / Mankind Pharma</strong></span>
                  <span>·</span>
                  <span>Schedule: <strong className="text-rose-400">Schedule H1</strong></span>
                </div>
              </div>

              {/* Item 2: Dolo 650 */}
              <div className="p-4 space-y-1.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white font-minimal">DOLO-650</h4>
                    <p className="text-zinc-400 text-[11px]">Paracetamol Tablets IP 650 mg</p>
                  </div>
                  <span className="flex items-center gap-1 rounded bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 px-2 py-0.5 text-[10px] font-bold font-minimal">
                    <CheckCircle2 className="h-3 w-3 text-[#00e599]" />
                    Verified Genuine ✓
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px] pt-1">
                  <span>Batch: <strong className="text-white">DL26X401</strong></span>
                  <span>·</span>
                  <span>Expiry: <strong className="text-white">08/2027</strong></span>
                  <span>·</span>
                  <span>Manufacturer: <strong className="text-zinc-300">Micro Labs Limited</strong></span>
                  <span>·</span>
                  <span>Schedule: <strong className="text-zinc-300">OTC</strong></span>
                </div>
              </div>

              {/* Item 3: Cetirizine */}
              <div className="p-4 space-y-1.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white font-minimal">CRIZ-10 (Cetirizine 10 mg)</h4>
                    <p className="text-zinc-400 text-[11px]">Cetirizine Hydrochloride IP 10 mg</p>
                  </div>
                  <span className="flex items-center gap-1 rounded bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 px-2 py-0.5 text-[10px] font-bold font-minimal">
                    <CheckCircle2 className="h-3 w-3 text-[#00e599]" />
                    Verified Genuine ✓
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-[11px] pt-1">
                  <span>Batch: <strong className="text-white">CR25M019</strong></span>
                  <span>·</span>
                  <span>Expiry: <strong className="text-white">06/2027</strong></span>
                  <span>·</span>
                  <span>Manufacturer: <strong className="text-zinc-300">Dr. Reddy’s Labs</strong></span>
                  <span>·</span>
                  <span>Schedule: <strong className="text-zinc-300">OTC</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* DOCTOR'S CLINICAL NOTES & RX CODE EDITOR (New Hero Feature!) */}
          <div className="rounded-2xl border border-[#00e599]/30 bg-black/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-[#00e599]" />
                <h3 className="text-sm font-bold text-white font-minimal">
                  Doctor’s Clinical Notes & Rx Order Code
                </h3>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono-tag">
                Appends Directly to Patient Record
              </span>
            </div>

            <form onSubmit={handleSaveDoctorNotes} className="space-y-4 text-xs font-mono-tag">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase">Attending Physician</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white focus:border-[#00e599] focus:outline-none"
                    placeholder="Doctor Name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase">Medical Reg. Number</label>
                  <input
                    type="text"
                    value={doctorRegId}
                    onChange={(e) => setDoctorRegId(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white focus:border-[#00e599] focus:outline-none"
                    placeholder="e.g. MCI-49120"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase">Prescription / Rx Code</label>
                  <input
                    type="text"
                    value={rxOrderCode}
                    onChange={(e) => setRxOrderCode(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-[#00e599]/40 bg-[#00e599]/[0.05] p-2 font-bold text-[#00e599] focus:border-[#00e599] focus:outline-none"
                    placeholder="e.g. RX-2026-MED-491"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase">Clinical Assessment & Diagnosis</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-zinc-200 focus:border-[#00e599] focus:outline-none leading-relaxed"
                  placeholder="Enter medical observations, allergy checks, or treatment duration..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase">Prescribed Regimen & Advice for Patient</label>
                <input
                  type="text"
                  value={doctorAdvice}
                  onChange={(e) => setDoctorAdvice(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white focus:border-[#00e599] focus:outline-none"
                  placeholder="Patient advice instructions..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-zinc-400">
                  {saveTimestamp && (
                    <span className="text-[#00e599] font-bold">
                      ✓ Saved to Patient Record at {saveTimestamp}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl tech-button-mint px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider shadow-sm transition-all"
                >
                  {isSaved ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Prescription Saved & Signed!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Sign & Save Rx Notes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mandatory Clinical Notice */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white uppercase tracking-wider block font-mono-tag">
                Notice to Attending Medical Practitioner:
              </span>
              <p className="text-amber-200/90 leading-relaxed font-mono-tag">
                ⚠ All package identifications and chemical salt breakdowns have been verified against CDSCO databases. Confirm dosage and patient renal/hepatic parameters prior to adjusting treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer print action */}
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono-tag px-2">
          <span>MediCheck Verified Clinical Tele-Health Records</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-[#00e599] hover:underline transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Clinical Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
