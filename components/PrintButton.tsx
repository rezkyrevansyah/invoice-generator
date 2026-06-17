'use client';

import { useState } from 'react';
import type { PrintTarget } from '@/app/generator/page';
import { useDownloadPdf } from '@/hooks/useDownloadPdf';

interface PrintButtonProps {
  printTarget: PrintTarget;
  onChangePrintTarget: (target: PrintTarget) => void;
  variant?: 'default' | 'settlement' | 'reimbursement';
  filename?: string;
}

const TARGET_OPTIONS: { value: PrintTarget; label: string; desc: string }[] = [
  { value: 'both', label: 'Invoice + Work Agreement', desc: 'Cetak kedua dokumen (2 halaman)' },
  { value: 'invoice', label: 'Invoice Saja', desc: 'Hanya halaman 1 — Invoice & detail pembayaran' },
  { value: 'agreement', label: 'Work Agreement Saja', desc: 'Hanya halaman 2 — Perjanjian kerja' },
];

export default function PrintButton({
  printTarget,
  onChangePrintTarget,
  variant = 'default',
  filename,
}: PrintButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<PrintTarget>(printTarget);
  const { downloadPdf, isGenerating } = useDownloadPdf();

  function openModal() {
    setSelectedTarget(printTarget);
    setShowModal(true);
  }

  function handlePrint() {
    onChangePrintTarget(selectedTarget);
    setShowModal(false);
    setTimeout(() => window.print(), 80);
  }

  async function handleDownload() {
    const pdfTarget = variant === 'settlement' ? 'settlement' : variant === 'reimbursement' ? 'reimbursement' : printTarget;
    const defaultName = variant === 'settlement' ? 'settlement.pdf' : variant === 'reimbursement' ? 'reimbursement.pdf' : `${printTarget}.pdf`;
    await downloadPdf(pdfTarget, filename ?? defaultName);
  }

  return (
    <div className="no-print w-full flex gap-2">
      {/* Print button */}
      <button
        onClick={openModal}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors border"
        style={{ borderColor: '#0F6E56', color: '#0F6E56', backgroundColor: '#fff' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>

      {/* Download PDF button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#0F6E56' }}
      >
        {isGenerating ? (
          <>
            <svg className="w-4 h-4 flex-shrink-0 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </>
        )}
      </button>

      {/* Print modal */}
      {showModal && (
        <>
          <div
            className="no-print fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md mx-4 pointer-events-auto">

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Print Dokumen</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {variant === 'settlement' ? 'Invoice Pelunasan akan dicetak' : variant === 'reimbursement' ? 'Reimbursement Invoice akan dicetak' : 'Pilih dokumen yang ingin dicetak'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Document selector — only for default variant */}
              {variant === 'default' && (
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
                          style={selectedTarget === opt.value ? { borderColor: '#0F6E56' } : { borderColor: '#cbd5e1' }}
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
              )}

              {/* Print instructions */}
              <div className="rounded-xl p-3 mb-5" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p className="text-xs font-semibold text-slate-500 mb-2">Petunjuk cetak:</p>
                <ol className="flex flex-col gap-1 pl-4 text-xs text-slate-500" style={{ listStyleType: 'decimal' }}>
                  <li>Di dialog Print, pilih printer atau <strong className="text-slate-700">Save as PDF</strong></li>
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
