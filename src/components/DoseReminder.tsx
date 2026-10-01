import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  AlertCircle,
  Plus,
  Pill,
  Check
} from 'lucide-react';
import { Medicine, Reminder } from '../types';
import { dbService } from '../lib/supabase';

interface DoseReminderProps {
  currentMedicine: Medicine;
  onNavigate: (view: string) => void;
}

export const DoseReminder: React.FC<DoseReminderProps> = ({
  currentMedicine,
  onNavigate,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>(() => dbService.getLocalReminders());

  // Form State
  const [frequency, setFrequency] = useState<string>('Twice daily (Every 12 hrs)');
  const [time, setTime] = useState<string>('08:00 AM');
  const [durationDays, setDurationDays] = useState<number>(5);
  const [createdSuccess, setCreatedSuccess] = useState<boolean>(false);

  const calculateEndDate = (days: number): string => {
    const end = new Date(Date.now() + days * 86400000);
    return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      user_id: 'patient-demo-01',
      medicine_id: currentMedicine.id,
      medicine_name: currentMedicine.brand_name,
      time: time,
      frequency: frequency,
      start_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end_date: calculateEndDate(durationDays),
      duration_days: durationDays,
      status: 'ACTIVE',
    };

    await dbService.saveReminder(newReminder);
    setReminders([newReminder, ...reminders]);
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 5000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2 font-minimal">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00e599]/30 bg-[#00e599]/10 px-4 py-1 text-xs text-[#00e599] font-mono-tag">
          <Bell className="h-3.5 w-3.5 text-[#00e599]" />
          <span>Patient Prescribed Schedule</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight font-minimal">
          Dose <span className="text-[#00e599]">Reminders</span>
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Set prescribed timing and duration to receive precise adherence alerts on your device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Schedule Creator Form */}
        <div className="md:col-span-6 rounded-3xl tech-card p-6 shadow-2xl space-y-5">
          <div className="border-b border-[#00e599]/15 pb-3 space-y-1">
            <span className="text-[10px] font-mono-tag text-zinc-500 uppercase tracking-wider">Configuring Dose For:</span>
            <div className="text-lg font-bold text-white flex items-center gap-2 font-minimal">
              <Pill className="h-4 w-4 text-[#00e599]" />
              <span>{currentMedicine.brand_name}</span>
            </div>
            <p className="text-xs text-[#00e599] font-mono-tag">{currentMedicine.strength}</p>
          </div>

          <form onSubmit={handleCreateReminder} className="space-y-4 text-xs font-mono-tag">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5 font-minimal">How often?</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-white text-xs focus:border-[#00e599] focus:outline-none"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily (Every 12 hrs)">Twice daily (Every 12 hrs)</option>
                <option value="Three times daily (Every 8 hrs)">Three times daily (Every 8 hrs)</option>
                <option value="As needed (SOS)">As needed (SOS for pain/fever)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5 font-minimal">First Dose Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 08:00 AM"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-white text-xs focus:border-[#00e599] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5 font-minimal">Course Duration</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-white text-xs focus:border-[#00e599] focus:outline-none"
                >
                  <option value={3}>3 days</option>
                  <option value={5}>5 days (Standard)</option>
                  <option value={7}>7 days</option>
                  <option value={10}>10 days</option>
                  <option value={30}>30 days (Chronic)</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3 text-[11px] text-zinc-400">
              Prescription window: Active until <strong className="text-white">{calculateEndDate(durationDays)}</strong>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl tech-button-mint py-3.5 text-xs font-extrabold uppercase tracking-wide text-black shadow-md transition-all active:scale-95 font-minimal"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Set Reminder</span>
            </button>
          </form>

          {createdSuccess && (
            <div className="rounded-2xl border border-[#00e599]/40 bg-[#00e599]/15 p-4 text-xs text-[#00e599] space-y-1">
              <div className="flex items-center gap-2 font-bold text-white font-minimal">
                <CheckCircle2 className="h-4 w-4 text-[#00e599]" />
                <span>Reminder Created Successfully</span>
              </div>
              <p className="font-mono-tag text-[11px] text-zinc-300">
                {currentMedicine.brand_name} · Every day · {time} until {calculateEndDate(durationDays)}
              </p>
            </div>
          )}
        </div>

        {/* Right: Active Dose Timeline */}
        <div className="md:col-span-6 space-y-3">
          <h3 className="text-xs font-mono-tag font-bold uppercase tracking-wider text-zinc-400 px-1">
            Active Patient Reminders ({reminders.length})
          </h3>

          <div className="space-y-2.5">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="rounded-2xl tech-card p-4 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white font-minimal">{rem.medicine_name}</span>
                    <span className="rounded-full bg-[#00e599]/20 px-2 py-0.2 text-[9px] font-mono-tag font-bold text-[#00e599] border border-[#00e599]/30">
                      {rem.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono-tag">
                    <Clock className="h-3.5 w-3.5 text-[#00e599]" />
                    <span>{rem.time}</span>
                    <span>·</span>
                    <span>{rem.frequency}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono-tag">
                    Active until {rem.end_date}
                  </div>
                </div>

                <button
                  onClick={() => setReminders(reminders.filter((r) => r.id !== rem.id))}
                  className="rounded-lg p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Remove reminder"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
