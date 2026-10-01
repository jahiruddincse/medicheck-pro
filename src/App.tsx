import React, { useState } from 'react';
import { Medicine, MedicineScan } from './types';
import { curatedMedicines, initialDemoHistory } from './data/medicineDb';
import { dbService } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { SmartScanner } from './components/SmartScanner';
import { MedicineDetail } from './components/MedicineDetail';
import { MedicineAlternatives } from './components/MedicineAlternatives';
import { DoseReminder } from './components/DoseReminder';
import { MyHealthHistory } from './components/MyHealthHistory';
import { DoctorShareModal } from './components/DoctorShareModal';
import { DoctorView } from './components/DoctorView';
import { MedicineChatbot } from './components/MedicineChatbot';

export default function App() {
  const isDoctorRoute = window.location.pathname.includes('/doctor') || window.location.search.includes('token');

  // Navigation State
  const [currentView, setCurrentView] = useState<string>(() => {
    return isDoctorRoute ? 'doctor-view' : 'scanner';
  });

  // Active Scanned Medicine (Defaults to GUDCEF-CV 200)
  const [activeMedicine, setActiveMedicine] = useState<Medicine>(curatedMedicines[0]);
  const [activeScan, setActiveScan] = useState<MedicineScan | null>(initialDemoHistory[0]);

  // Scan History
  const [scans, setScans] = useState<MedicineScan[]>(() => dbService.getLocalHistory());

  // Modals
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  // Sync scan completion
  const handleScanComplete = (scan: MedicineScan, medicine: Medicine) => {
    setActiveScan(scan);
    setActiveMedicine(medicine);
    setScans((prev) => [scan, ...prev.filter((s) => s.id !== scan.id)]);
    // Directly routes to medicine detail page
    setCurrentView('medicine-detail');
  };

  // Open doctor view directly
  const handleOpenDoctorView = () => {
    setCurrentView('doctor-view');
  };

  if (currentView === 'doctor-view') {
    return (
      <DoctorView
        tokenCode="MGX-7F92-K31"
        onClose={() => setCurrentView('medicine-detail')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#040906] text-[#e8f2ec] flex flex-col font-sans selection:bg-[#00e599] selection:text-black">
      {/* MediCheck Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenDoctorModal={() => setIsDoctorModalOpen(true)}
        onOpenDoctorView={handleOpenDoctorView}
      />

      {/* Main Container */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-4 max-w-6xl w-full mx-auto">
        {currentView === 'scanner' && (
          <SmartScanner
            onScanComplete={handleScanComplete}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'medicine-detail' && (
          <MedicineDetail
            medicine={activeMedicine}
            activeScan={activeScan}
            onNavigate={setCurrentView}
            onOpenReminderModal={() => setCurrentView('reminders')}
            onOpenDoctorModal={() => setIsDoctorModalOpen(true)}
            onOpenChat={() => setIsChatbotOpen(true)}
          />
        )}

        {currentView === 'alternatives' && (
          <MedicineAlternatives
            currentMedicine={activeMedicine}
            onNavigate={setCurrentView}
            onSelectAlternative={(altName) => {
              setIsChatbotOpen(true);
            }}
          />
        )}

        {currentView === 'reminders' && (
          <DoseReminder
            currentMedicine={activeMedicine}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'history' && (
          <MyHealthHistory
            scans={scans}
            onSelectScan={(scan) => {
              if (scan.medicine) setActiveMedicine(scan.medicine);
              setActiveScan(scan);
              setCurrentView('medicine-detail');
            }}
            onOpenDoctorModal={() => setIsDoctorModalOpen(true)}
            onOpenScanner={() => setCurrentView('scanner')}
          />
        )}
      </main>

      {/* Doctor Temporary Share Modal */}
      {isDoctorModalOpen && (
        <DoctorShareModal
          scans={scans}
          onClose={() => setIsDoctorModalOpen(false)}
          onOpenDoctorView={handleOpenDoctorView}
        />
      )}

      {/* Clinical AI Assistant Modal */}
      {isChatbotOpen && (
        <MedicineChatbot
          medicine={activeMedicine}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}

      {/* Floating Clinical Chatbot Launcher */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full tech-button-mint px-4 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_10px_35px_rgba(0,229,153,0.35)] transition-all hover:scale-105 active:scale-95"
        title="Open MediCheck Clinical AI Assistant"
      >
        <span className="flex h-2 w-2 rounded-full bg-black animate-ping" />
        <span className="font-minimal font-bold">Ask Clinical AI</span>
      </button>

      {/* Minimal Tech Footer */}
      <footer className="border-t border-[#00e599]/15 bg-black/60 py-8 px-4 text-xs text-zinc-500 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tag">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MediCheck</span>
            <span>·</span>
            <span>Intelligent Medicine Verification & Substitute Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span>YOLOv8 + Neural Vision + Supabase Cloud</span>
            <span>·</span>
            <span>CDSCO Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
