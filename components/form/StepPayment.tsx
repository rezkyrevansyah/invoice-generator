'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { FreelancerData, InvoiceFormData } from '@/lib/types';

interface StepPaymentProps {
  data: InvoiceFormData;
  onChange: (field: keyof InvoiceFormData, value: InvoiceFormData[keyof InvoiceFormData]) => void;
  freelancerData: FreelancerData;
  onUpdateFreelancer: (data: FreelancerData) => void;
}

const DISPLAY_OPTIONS: { value: InvoiceFormData['paymentDisplay']; label: string }[] = [
  { value: 'both', label: 'Tampilkan Keduanya' },
  { value: 'A',    label: 'Option A Saja' },
  { value: 'B',    label: 'Option B Saja' },
  { value: 'none', label: 'Sembunyikan Semua' },
];

export default function StepPayment({
  data,
  onChange,
  freelancerData,
  onUpdateFreelancer,
}: StepPaymentProps) {
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<FreelancerData>(freelancerData);

  function openModal() {
    setDraft({ ...freelancerData });
    setShowModal(true);
  }

  function saveModal() {
    onUpdateFreelancer(draft);
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-slate-800 mb-1">Pilih Opsi Pembayaran</h2>

      {/* Option A */}
      <button
        type="button"
        onClick={() => onChange('paymentOption', 'A')}
        className="text-left w-full rounded-xl border-2 p-4 transition-colors"
        style={
          data.paymentOption === 'A'
            ? { borderColor: '#0F6E56', backgroundColor: '#E1F5EE' }
            : { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }
        }
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{data.paymentOption === 'A' ? '☑' : '☐'}</span>
          <span className="font-semibold text-sm" style={{ color: '#0F6E56' }}>
            OPTION A: FULL PAYMENT 100%
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pembayaran 100% di awal agar project bisa langsung running setelah terkonfirmasi,
          tanpa perlu berhenti untuk menunggu pembayaran ke-2.
        </p>
      </button>

      {/* Option B */}
      <button
        type="button"
        onClick={() => onChange('paymentOption', 'B')}
        className="text-left w-full rounded-xl border-2 p-4 transition-colors"
        style={
          data.paymentOption === 'B'
            ? { borderColor: '#0F6E56', backgroundColor: '#E1F5EE' }
            : { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }
        }
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{data.paymentOption === 'B' ? '☑' : '☐'}</span>
          <span className="font-semibold text-sm" style={{ color: '#0F6E56' }}>
            OPTION B: DOWN PAYMENT 50% + PELUNASAN 50%
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          DP 50% di awal sebelum pekerjaan dimulai. Pembayaran ke-2 dilakukan setelah progress
          50% selesai, lalu progress berikutnya dilanjutkan setelah pelunasan diterima.
        </p>
      </button>

      {/* ── Tampilan di dokumen ─────────────────────────────────────────────── */}
      <div className="rounded-xl border p-4" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Tampilkan di Dokumen
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DISPLAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('paymentDisplay', opt.value)}
              className="text-left rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
              style={
                data.paymentDisplay === opt.value
                  ? { borderColor: '#0F6E56', backgroundColor: '#E1F5EE', color: '#085041' }
                  : { borderColor: '#e2e8f0', backgroundColor: '#ffffff', color: '#64748b' }
              }
            >
              <span className="mr-1">{data.paymentDisplay === opt.value ? '●' : '○'}</span>
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Mengontrol payment options yang muncul di preview &amp; dokumen cetak.
        </p>
      </div>

      {/* Info Rekening */}
      <div className="rounded-xl border p-4" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Info Rekening Transfer</span>
          <button
            type="button"
            onClick={openModal}
            className="text-xs underline"
            style={{ color: '#0F6E56' }}
          >
            Edit info rekening
          </button>
        </div>
        <div className="flex flex-col gap-1 text-sm text-slate-700">
          <div className="flex gap-2">
            <span className="w-28 text-slate-400">Bank</span>
            <span>: {freelancerData.bank}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-slate-400">No. Rekening</span>
            <span className="font-semibold">: {freelancerData.accountNumber}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-slate-400">Atas Nama</span>
            <span>: {freelancerData.accountName}</span>
          </div>
        </div>
      </div>

      {/* Modal Edit Freelancer — rendered via portal to avoid stacking context issues */}
      {showModal && createPortal(
        <div className="no-print fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Edit Info Rekening & Freelancer</h3>
            <div className="flex flex-col gap-3">
              {(
                [
                  { field: 'name', label: 'Nama Lengkap' },
                  { field: 'title', label: 'Jabatan / Title' },
                  { field: 'experience', label: 'Pengalaman' },
                  { field: 'bank', label: 'Bank' },
                  { field: 'accountNumber', label: 'Nomor Rekening' },
                  { field: 'accountName', label: 'Nama Pemilik Rekening' },
                ] as { field: keyof FreelancerData; label: string }[]
              ).map(({ field, label }) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">{label}</label>
                  <input
                    type="text"
                    value={draft[field]}
                    onChange={(e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveModal}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#0F6E56' }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
