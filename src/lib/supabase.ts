import { createClient } from '@supabase/supabase-js';
import { MedicineScan, Reminder, ShareToken } from '../types';
import { initialDemoHistory } from '../data/medicineDb';

// Supabase configuration provided by the user
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uqwezrrkaiduumhtpltj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Robust client-side database layer with Supabase + resilient local fallback
export const dbService = {
  // Save scan result
  async saveScan(scan: MedicineScan): Promise<boolean> {
    try {
      // Attempt saving to Supabase table 'medicine_scans'
      const { error } = await supabase.from('medicine_scans').insert([
        {
          id: scan.id,
          user_id: scan.user_id,
          medicine_id: scan.medicine_id,
          batch_number: scan.batch_number,
          manufacturing_date: scan.manufacturing_date,
          expiry_date: scan.expiry_date,
          qr_payload: scan.qr_payload,
          scan_time: scan.scan_time,
          verification_status: scan.verification_status,
          detected_brand: scan.detected_brand,
        },
      ]);

      if (error) {
        console.warn('Supabase remote insert notice (falling back to cached storage):', error.message);
      }
    } catch (err) {
      console.warn('Supabase network error, persisting locally:', err);
    }

    // Always update local storage
    try {
      const history = dbService.getLocalHistory();
      const updated = [scan, ...history.filter((s) => s.id !== scan.id)];
      localStorage.setItem('mediguard_scans', JSON.stringify(updated));
    } catch (e) {
      console.error('Local storage write error:', e);
    }
    return true;
  },

  // Get scan history
  getLocalHistory(): MedicineScan[] {
    try {
      const saved = localStorage.getItem('mediguard_scans');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Local storage read error:', e);
    }
    return initialDemoHistory;
  },

  // Save Reminder
  async saveReminder(reminder: Reminder): Promise<boolean> {
    try {
      await supabase.from('reminders').insert([
        {
          id: reminder.id,
          user_id: reminder.user_id,
          medicine_id: reminder.medicine_id,
          medicine_name: reminder.medicine_name,
          time: reminder.time,
          frequency: reminder.frequency,
          start_date: reminder.start_date,
          end_date: reminder.end_date,
          status: reminder.status,
        },
      ]);
    } catch (err) {
      console.warn('Supabase reminder sync notice:', err);
    }

    try {
      const reminders = dbService.getLocalReminders();
      const updated = [reminder, ...reminders.filter((r) => r.id !== reminder.id)];
      localStorage.setItem('mediguard_reminders', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return true;
  },

  getLocalReminders(): Reminder[] {
    try {
      const saved = localStorage.getItem('mediguard_reminders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'rem-demo-1',
        user_id: 'patient-demo-01',
        medicine_id: 'med-gudcef-cv-200',
        medicine_name: 'GUDCEF-CV 200',
        time: '08:00 AM',
        frequency: 'Twice daily (After food)',
        start_date: '2026-09-30',
        end_date: '2026-10-06',
        duration_days: 5,
        status: 'ACTIVE',
      },
    ];
  },

  // Create temporary share token for doctor QR scan
  async createShareToken(token: ShareToken): Promise<boolean> {
    try {
      await supabase.from('share_tokens').insert([
        {
          id: token.id,
          user_id: token.user_id,
          token_hash: token.token_code,
          expires_at: token.expires_at,
          revoked: token.revoked,
          payload: token,
        },
      ]);
    } catch (err) {
      console.warn('Supabase token sync notice:', err);
    }

    try {
      const tokens = dbService.getLocalShareTokens();
      tokens[token.token_code] = token;
      localStorage.setItem('mediguard_tokens', JSON.stringify(tokens));
    } catch (e) {
      console.error(e);
    }
    return true;
  },

  getShareToken(tokenCode: string): ShareToken | null {
    try {
      const tokens = dbService.getLocalShareTokens();
      if (tokens[tokenCode]) {
        return tokens[tokenCode];
      }
    } catch (e) {
      console.error(e);
    }

    // Default sample share token for quick testing
    if (tokenCode === 'MGX-7F92-K31') {
      return {
        id: 'token-demo-sample',
        user_id: 'patient-demo-01',
        token_code: 'MGX-7F92-K31',
        patient_name: 'Aditya Verma (Patient #4082)',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 28 * 60 * 1000).toISOString(),
        duration_minutes: 30,
        include_history: true,
        include_verification: true,
        include_current_doses: true,
        revoked: false,
        items: [
          {
            brand_name: 'GUDCEF-CV 200',
            dosage_form: 'Film-coated Tablet',
            strength: 'Cefpodoxime 200mg + Clavulanic 125mg',
            batch_number: 'A3AEY041',
            expiry_date: '10/2026',
            verified: true,
            scan_date: '30 Sep 2026, 19:42',
            schedule_class: 'Schedule H1',
          },
          {
            brand_name: 'DOLO-650',
            dosage_form: 'Uncoated Tablet',
            strength: 'Paracetamol 650mg',
            batch_number: 'DL26X401',
            expiry_date: '08/2027',
            verified: true,
            scan_date: '28 Sep 2026, 14:15',
            schedule_class: 'OTC',
          },
          {
            brand_name: 'CRIZ-10 (CETIRIZINE)',
            dosage_form: 'Film-coated Tablet',
            strength: 'Cetirizine 10mg',
            batch_number: 'CR25M019',
            expiry_date: '06/2027',
            verified: true,
            scan_date: '22 Sep 2026, 09:10',
            schedule_class: 'OTC',
          },
        ],
      };
    }

    return null;
  },

  getLocalShareTokens(): Record<string, ShareToken> {
    try {
      const saved = localStorage.getItem('mediguard_tokens');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  },
};
