export interface FreelancerData {
  name: string;           // 'M. Rezky Revansyah Suprihono'
  title: string;          // 'Software Engineer, UI/UX Designer & Full-Stack Developer'
  experience: string;     // '3+ Years'
  bank: string;           // 'BCA'
  accountNumber: string;  // '0661642679'
  accountName: string;    // 'M. Rezky Revansyah Suprihono'
}

export interface InvoiceFormData {
  // Step 1 — Info Dokumen
  invoiceNumber: string;
  agreementNumber: string;
  invoiceDate: string;          // ISO date string (YYYY-MM-DD)
  agreementDate: string;        // default = sama dengan invoiceDate
  initialPaymentDue: string;    // default = invoiceDate + 1 hari
  projectDeadline: string;

  // Step 2 — Info Client
  clientCompany: string;
  clientPIC: string;

  // Step 3 — Detail Project
  projectName: string;
  scopeOfWork: string;
  deliverables: string;
  revisionRounds: number;
  projectDuration: number;      // dalam hari kerja
  startDate: string;
  endDate: string;
  progressUpdate: string;
  projectValue: number;         // dalam Rupiah (integer)

  // Step 4 — Pembayaran
  paymentOption: 'A' | 'B' | null;
  // Kontrol tampilan payment options di dokumen
  paymentDisplay: 'both' | 'A' | 'B' | 'none';
}

export interface InvoiceDraft {
  formData: InvoiceFormData;
  currentStep: number;
  savedAt: string; // ISO 8601
}

export interface ReimbursementItem {
  id: string;           // crypto.randomUUID() — React key + removal target
  description: string;
  amount: number;       // Rupiah integer
}

export interface SettlementFormData {
  // Dokumen
  settlementNumber: string;       // INV-LNS/YYYY/MM/NNN
  settlementDate: string;         // YYYY-MM-DD

  // Referensi ke invoice asli
  originalInvoiceId: string;      // uuid dari invoices table
  originalInvoiceNumber: string;  // INV/YYYY/MM/NNN

  // Snapshot client & project (editable)
  clientCompany: string;
  clientPIC: string;
  projectName: string;
  projectValue: number;

  // Computed (derived dari projectValue, selalu projectValue / 2)
  dpAmount: number;
  remainingAmount: number;

  // Reimbursement
  reimbursementItems: ReimbursementItem[];

  // Images — hanya URLs (File[] disimpan di state terpisah, tidak serializable)
  imageUrls: string[];

  // Bank info snapshot dari FreelancerData
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface SettlementDraft {
  formData: SettlementFormData;
  savedAt: string; // ISO 8601
}

export interface ReimbursementOnlyFormData {
  reimbursementNumber: string;   // RMB/2026/06/001
  reimbursementDate: string;     // YYYY-MM-DD
  clientCompany: string;
  clientPIC: string;
  projectName: string;
  reimbursementItems: ReimbursementItem[];
  imageUrls: string[];
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface ReimbursementOnlyDraft {
  formData: ReimbursementOnlyFormData;
  savedAt: string; // ISO 8601
}
