// ─── Invoice / Agreement Number ───────────────────────────────────────────────

function padCounter(n: number): string {
  return String(n).padStart(3, '0');
}

function getAndIncrementCounter(storageKey: string): number {
  if (typeof window === 'undefined') return 1;
  const raw = localStorage.getItem(storageKey);
  const current = raw ? parseInt(raw, 10) : 0;
  const next = current + 1;
  localStorage.setItem(storageKey, String(next));
  return next;
}

export function generateInvoiceNumber(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const counter = getAndIncrementCounter(`invoice-counter-${yyyy}-${mm}`);
  return `INV/${yyyy}/${mm}/${padCounter(counter)}`;
}

export function generateAgreementNumber(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const counter = getAndIncrementCounter(`agreement-counter-${yyyy}-${mm}`);
  return `WA/${yyyy}/${mm}/${padCounter(counter)}`;
}

// ─── Format Rupiah ─────────────────────────────────────────────────────────────

export function formatRupiah(amount: number): string {
  const formatted = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted},-`;
}

// ─── Format Rupiah Words (Terbilang) ──────────────────────────────────────────

const satuan = [
  '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
  'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh',
  'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas',
  'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas',
];

const puluhan = [
  '', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh',
  'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh',
];

function terbilangRatusan(n: number): string {
  if (n === 0) return '';
  if (n < 20) return satuan[n];
  if (n < 100) {
    const tens = puluhan[Math.floor(n / 10)];
    const ones = satuan[n % 10];
    return ones ? `${tens} ${ones}` : tens;
  }
  // 100–999
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const prefix = hundreds === 1 ? 'Seratus' : `${satuan[hundreds]} Ratus`;
  const rest = terbilangRatusan(remainder);
  return rest ? `${prefix} ${rest}` : prefix;
}

export function formatRupiahWords(amount: number): string {
  if (amount === 0) return 'Nol Rupiah';

  const trilliun = Math.floor(amount / 1_000_000_000_000);
  const miliar = Math.floor((amount % 1_000_000_000_000) / 1_000_000_000);
  const juta = Math.floor((amount % 1_000_000_000) / 1_000_000);
  const ribu = Math.floor((amount % 1_000_000) / 1_000);
  const sisa = amount % 1_000;

  const parts: string[] = [];

  if (trilliun > 0) parts.push(`${terbilangRatusan(trilliun)} Triliun`);
  if (miliar > 0) parts.push(`${terbilangRatusan(miliar)} Miliar`);
  if (juta > 0) parts.push(`${terbilangRatusan(juta)} Juta`);
  if (ribu > 0) {
    parts.push(ribu === 1 ? 'Seribu' : `${terbilangRatusan(ribu)} Ribu`);
  }
  if (sisa > 0) parts.push(terbilangRatusan(sisa));

  return `${parts.join(' ')} Rupiah`;
}

// ─── Validasi Step ────────────────────────────────────────────────────────────

import type { InvoiceFormData, SettlementFormData, ReimbursementOnlyFormData } from './types';

export function validateStep(step: number, data: InvoiceFormData): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!data.invoiceDate) errors.push('Tanggal invoice tidak boleh kosong.');
    if (!data.projectDeadline) errors.push('Deadline project tidak boleh kosong.');
  }
  if (step === 2) {
    if (!data.clientCompany.trim()) errors.push('Nama perusahaan client tidak boleh kosong.');
    if (!data.clientPIC.trim()) errors.push('Nama PIC tidak boleh kosong.');
  }
  if (step === 3) {
    if (!data.projectName.trim()) errors.push('Nama project tidak boleh kosong.');
    if (data.projectValue <= 0) errors.push('Nilai project harus lebih dari 0.');
  }
  if (step === 4) {
    if (!data.paymentOption) errors.push('Pilih salah satu opsi pembayaran.');
  }
  return errors;
}

// ─── Settlement Number ────────────────────────────────────────────────────────

export function generateReimbursementNumber(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const counter = getAndIncrementCounter(`reimbursement-counter-${yyyy}-${mm}`);
  return `RMB/${yyyy}/${mm}/${padCounter(counter)}`;
}

export function generateSettlementNumber(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const counter = getAndIncrementCounter(`settlement-counter-${yyyy}-${mm}`);
  return `INV-LNS/${yyyy}/${mm}/${padCounter(counter)}`;
}

// ─── Validasi Settlement ──────────────────────────────────────────────────────

export function validateSettlement(data: SettlementFormData): string[] {
  const errors: string[] = [];
  if (!data.settlementDate) errors.push('Tanggal invoice pelunasan tidak boleh kosong.');
  if (!data.originalInvoiceNumber.trim()) errors.push('Nomor invoice referensi tidak boleh kosong.');
  if (!data.clientCompany.trim()) errors.push('Nama perusahaan client tidak boleh kosong.');
  if (!data.clientPIC.trim()) errors.push('Nama PIC tidak boleh kosong.');
  if (!data.projectName.trim()) errors.push('Nama project tidak boleh kosong.');
  if (data.projectValue <= 0) errors.push('Nilai project harus lebih dari 0.');
  for (const item of data.reimbursementItems) {
    if (!item.description.trim()) errors.push('Deskripsi reimbursement tidak boleh kosong.');
    if (item.amount <= 0) errors.push('Nominal reimbursement harus lebih dari 0.');
  }
  return errors;
}

// ─── Validasi Reimbursement ───────────────────────────────────────────────────

export function validateReimbursement(data: ReimbursementOnlyFormData): string[] {
  const errors: string[] = [];
  if (!data.reimbursementDate) errors.push('Tanggal reimbursement tidak boleh kosong.');
  if (!data.clientCompany.trim()) errors.push('Nama perusahaan client tidak boleh kosong.');
  if (!data.clientPIC.trim()) errors.push('Nama PIC tidak boleh kosong.');
  if (!data.projectName.trim()) errors.push('Nama project / keterangan tidak boleh kosong.');
  if (data.reimbursementItems.length === 0) errors.push('Minimal satu item reimbursement harus diisi.');
  for (const item of data.reimbursementItems) {
    if (!item.description.trim()) errors.push('Deskripsi item tidak boleh kosong.');
    if (item.amount <= 0) errors.push('Nominal item harus lebih dari 0.');
  }
  return errors;
}

// ─── Format Date ───────────────────────────────────────────────────────────────

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
];

function parseDateSafe(dateString: string): Date {
  // Parse YYYY-MM-DD as local date (avoids UTC offset shifting the day)
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateID(dateString: string): string {
  if (!dateString) return '';
  const d = parseDateSafe(dateString);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateLong(dateString: string): string {
  if (!dateString) return '';
  const d = parseDateSafe(dateString);
  const dayName = DAYS_ID[d.getDay()];
  return `${dayName}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}
