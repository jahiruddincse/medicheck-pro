export interface Medicine {
  id: string;
  brand_name: string;
  generic_name: string;
  manufacturer: string;
  composition: string;
  strength: string;
  dosage_form: string;
  pack_size: string;
  mrp: number; // in INR ₹
  license_number: string;
  product_code: string; // GTIN / Barcode
  // Clinical reference details (Mankind / verified guidelines)
  about: string;
  uses: string[];
  how_it_works: string;
  precautions: string[];
  side_effects: string[];
  food_information: string;
  storage: string;
  schedule_class: string; // 'Schedule H' | 'Schedule H1' | 'OTC'
}

export interface MedicineAlternative {
  id: string;
  medicine_id: string;
  alternative_brand: string;
  manufacturer: string;
  price: number;
  savings: number;
  same_composition: boolean;
  type: 'Generic Equivalent' | 'Alternative Brand' | 'Jan Aushadhi';
  composition_match: string;
}

export interface YoloDetectionBox {
  label: 'PACKAGE' | 'GS1_QR' | 'BATCH_EXP_REGION' | 'PILL_STRIP' | 'MANUFACTURER_LABEL';
  confidence: number;
  x: number; // 0 to 1 percentage
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface MedicineScan {
  id: string;
  user_id: string;
  medicine_id?: string;
  detected_brand: string;
  batch_number: string;
  manufacturing_date: string;
  expiry_date: string;
  qr_payload: string;
  scan_time: string;
  verification_status: 'MATCHED' | 'AUTHENTICATED' | 'SUSPECT' | 'UNVERIFIED';
  yolo_detections: YoloDetectionBox[];
  package_image_url?: string;
  confidence_score: number;
  medicine?: Medicine;
}

export interface Reminder {
  id: string;
  user_id: string;
  medicine_id: string;
  medicine_name: string;
  time: string; // e.g. '08:00 AM'
  frequency: string; // 'Once daily', 'Twice daily', 'Three times daily'
  start_date: string;
  end_date: string;
  duration_days: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export interface ShareToken {
  id: string;
  user_id: string;
  token_code: string; // e.g. 'MGX-7F92-K31'
  patient_name: string;
  created_at: string;
  expires_at: string;
  duration_minutes: number;
  include_history: boolean;
  include_verification: boolean;
  include_current_doses: boolean;
  revoked: boolean;
  items: Array<{
    brand_name: string;
    dosage_form: string;
    strength: string;
    batch_number: string;
    expiry_date: string;
    verified: boolean;
    scan_date: string;
    schedule_class?: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
