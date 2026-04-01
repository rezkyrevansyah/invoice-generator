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
