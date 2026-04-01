'use client';

import { useState } from 'react';
import type { PrintTarget } from '@/app/generator/page';

interface PrintButtonProps {
  printTarget: PrintTarget;
  onChangePrintTarget: (target: PrintTarget) => void;
}

const TARGET_OPTIONS: { value: PrintTarget; label: string; desc: string }[] = [
  { value: 'both', label: 'Invoice + Work Agreement', desc: 'Cetak kedua dokumen (2 halaman)' },
  { value: 'invoice', label: 'Invoice Saja', desc: 'Hanya halaman 1 — Invoice & detail pembayaran' },
  { value: 'agreement', label: 'Work Agreement Saja', desc: 'Hanya halaman 2 — Perjanjian kerja' },
];

export default function PrintButton({ printTarget, onChangePrintTarget }: PrintButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<PrintTarget>(printTarget);

  function openModal() {
    setSelectedTarget(printTarget);
    setShowModal(true);
  }

  function handlePrint() {
    onChangePrintTarget(selectedTarget);
    setShowModal(false);
    // Small delay so React re-renders the data attribute before print dialog opens
    setTimeout(() => window.print(), 80);
  }

  const currentLabel = TARGET_OPTIONS.find((o) => o.value === printTarget)?.label ?? 'Kedua Dokumen';

  return (
    <div className="no-print w-full">
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#0F6E56' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Download PDF / Print
        <span className="ml-1 text-xs font-normal opacity-80">— {currentLabel}</span>
      </button>

      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="no-print fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 pointer-events-auto">

              {/* Modal header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Download / Print PDF</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Pilih dokumen yang ingin dicetak</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Target selector */}
              <div className="flex flex-col gap-2 mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pilih Dokumen</p>
                {TARGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedTarget(opt.value)}
                    className="text-left w-full rounded-xl border-2 px-4 py-3 transition-all"
                    style={
                      selectedTarget === opt.value
                        ? { borderColor: '#0F6E56', backgroundColor: '#E1F5EE' }
                        : { borderColor: '#e2e8f0', backgroundColor: '#ffffff' }
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={
                          selectedTarget === opt.value
                            ? { borderColor: '#0F6E56' }
                            : { borderColor: '#cbd5e1' }
                        }
                      >
                        {selectedTarget === opt.value && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0F6E56' }} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: selectedTarget === opt.value ? '#0F6E56' : '#334155' }}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Instructions */}
              <div className="rounded-xl p-3 mb-5" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p className="text-xs font-semibold text-slate-500 mb-2">Petunjuk cetak ke PDF:</p>
                <ol className="flex flex-col gap-1 pl-4 text-xs text-slate-500" style={{ listStyleType: 'decimal' }}>
                  <li>Pastikan browser dalam mode desktop</li>
                  <li>Di dialog Print, pilih <strong className="text-slate-700">Save as PDF</strong></li>
                  <li>Set <strong className="text-slate-700">Paper size: A4</strong></li>
                  <li>Set <strong className="text-slate-700">Margins: Minimum</strong> atau <strong className="text-slate-700">None</strong></li>
                  <li>Aktifkan <strong className="text-slate-700">&quot;Print background graphics&quot;</strong></li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  Batal
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0F6E56' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Lanjut Print
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
