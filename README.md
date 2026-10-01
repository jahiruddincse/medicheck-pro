# MediCheck Pro — Intelligent Medicine Verification & Clinical History

An intelligent Indian medicine intelligence platform designed for rapid package verification, CDSCO compliance, bioequivalent generic substitutes, dosage reminders, and secure clinical doctor sharing.

---

## ⚡ Core Architecture

```
                       MEDICHECK PRO
                             │
                    📷 SCAN MEDICINE
                             │
                    ┌────────┴────────┐
                    ↓                 ↓
                 YOLOv8           QR DECODER
                    ↓                 ↓
              Pill/package      GS1 2D DataMatrix
                 region              data
                    │                 │
                    └────────┬────────┘
                             ↓
                    NEURAL VISION CORE
                             ↓
                   Structured Extraction
                             ↓
                    SUPABASE DATABASE
                             ↓
            ┌────────────────┼────────────────┐
            ↓                ↓                ↓
        Medicine         Substitutes       History
        Details          & Savings          Record
            ↓                ↓                ↓
            └────────────────┼────────────────┘
                             ↓
                      MEDICINE PAGE
                             │
              ┌──────────────┼──────────────┐
              ↓              ↓              ↓
         💊 Details      💰 Alternatives   ⏰ Reminder
                                             
                             ↓
                      📱 SHARE HISTORY
                             ↓
                      QR / ACCESS CODE
                             ↓
                      👨‍⚕️ DOCTOR PORTAL
                             ↓
                    CLINICAL Rx NOTES
```

---

## 🚀 Key Features

1. **Smart Scanner with Real-Time YOLOv8 Reticles**
   - Live camera detection with environment camera support.
   - Fallback to native mobile snap and file upload.
   - **10 Pre-Trained Medicine Packages**: Instant 1-click test suite covering top Indian medicines (GUDCEF-CV 200, DOLO-650, AUGMENTIN 625 DUO, PANTOCID DSR, AZITHRAL 500, CRIZ-10, SHELCAL 500, TELMA 40, GLYCOMET-GP 1, MONTAIR-LC).

2. **Medicine Intelligence & CDSCO Verification**
   - Active pharmaceutical salts, strengths, and manufacturing details.
   - Schedule classifications (Schedule H, Schedule H1, OTC).
   - Clinical pharmacology: Approved uses, mechanisms, precautions, side effects, and food interactions.

3. **Curated Bioequivalent Substitutes & Savings**
   - Verified same-composition generic equivalents (including PMBJP Jan Aushadhi).
   - Clear price comparisons and percentage savings calculation.

4. **Doctor Tele-Health Portal**
   - Time-limited QR code sharing and 6-character access codes (`MGX-7F92-K31`).
   - Doctors can look up records by typing/pasting patient codes.
   - **Doctor's Clinical Notes & Rx Editor**: Doctors can write diagnoses, issue prescription codes (`RX-2026-MED-491`), and sign/save records directly.

5. **Clinical AI Chatbot**
   - Always-accessible floating assistant (`Ask Clinical AI`) with strict pharmaceutical guardrails.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://uqwezrrkaiduumhtpltj.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"
```

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
