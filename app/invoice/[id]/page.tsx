'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Stepper from '@/components/Stepper';
import StepInfo from '@/components/form/StepInfo';
import StepClient from '@/components/form/StepClient';
import StepProject from '@/components/form/StepProject';
import StepPayment from '@/components/form/StepPayment';
import DocumentPreview from '@/components/preview/DocumentPreview';
import PrintButton from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { defaultFormData, defaultFreelancerData } from '@/lib/defaults';
import { validateStep } from '@/lib/utils';
import type { FreelancerData, InvoiceFormData } from '@/lib/types';
import type { PrintTarget } from '@/app/generator/page';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type LoadState = 'loading' | 'ready' | 'error';

function InvoiceDetailInner() {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [printTarget, setPrintTarget] = useState<PrintTarget>('both');
  const [freelancerData, setFreelancerData] = useLocalStorage<FreelancerData>(
    'freelancer-data',
    defaultFreelancerData
  );

  const hasLoaded = useRef(false);

  // Fetch invoice data on mount
  useEffect(() => {
    if (!id || hasLoaded.current) return;
    hasLoaded.current = true;

    fetch(`/api/invoices/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...formFields } = data;
        setFormData(formFields as InvoiceFormData);
        setLoadState('ready');
      })
      .catch(() => setLoadState('error'));
  }, [id]);

  function handleChange(
    field: keyof InvoiceFormData,
    value: InvoiceFormData[keyof InvoiceFormData]
  ) {
    setSaveState('idle');
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleUpdateFreelancer(data: FreelancerData) {
    setFreelancerData(data);
  }

  function handleNext() {
    const errs = validateStep(currentStep, formData);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  }

  function handleBack() {
    setErrors([]);
    setCurrentStep((prev) => prev - 1);
  }

  async function handleSave() {
    const errs = validateStep(currentStep, formData);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSaveState('saving');
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menyimpan');
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Memuat invoice...</p>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-4">Invoice tidak ditemukan.</p>
          <Link href="/history" className="text-sm text-slate-500 hover:text-slate-700">
            ← Kembali ke History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* ── Left: Form panel ──────────────────────────────────────────────────── */}
      <div
        className="form-panel no-print w-full lg:w-[45%] flex flex-col min-h-screen lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-100 flex items-center gap-3"
          style={{ backgroundColor: '#ffffff' }}
        >
          <Link
            href="/history"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-800 truncate">
              {formData.invoiceNumber || 'Detail Invoice'}
            </h1>
            <p className="text-xs text-slate-400 truncate">{formData.clientCompany || 'Edit invoice'}</p>
          </div>
        </div>

        {/* Stepper + Form content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          <Stepper currentStep={currentStep} />

          <div className="flex-1">
            {currentStep === 1 && (
              <StepInfo
                data={formData}
                onChange={handleChange as (field: keyof InvoiceFormData, value: string) => void}
              />
            )}
            {currentStep === 2 && (
              <StepClient
                data={formData}
                onChange={handleChange as (field: keyof InvoiceFormData, value: string) => void}
              />
            )}
            {currentStep === 3 && (
              <StepProject
                data={formData}
                onChange={handleChange as (field: keyof InvoiceFormData, value: string | number) => void}
              />
            )}
            {currentStep === 4 && (
              <StepPayment
                data={formData}
                onChange={handleChange}
                freelancerData={freelancerData}
                onUpdateFreelancer={handleUpdateFreelancer}
              />
            )}
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              {errors.map((e, i) => (
                <p key={i} className="text-sm text-red-600 flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0">&#x26A0;</span>
                  {e}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Navigation + Save buttons */}
        <div
          className="no-print sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 flex gap-3 border-t border-slate-100"
          style={{ backgroundColor: '#ffffff' }}
        >
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: '#e2e8f0', color: '#64748b', backgroundColor: '#ffffff' }}
          >
            ← Kembali
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
              style={{ backgroundColor: '#0F6E56' }}
            >
              Lanjut →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
              className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  saveState === 'saved' ? '#16a34a'
                  : saveState === 'error' ? '#dc2626'
                  : '#0F6E56',
              }}
            >
              {saveState === 'saving' && 'Menyimpan...'}
              {saveState === 'saved' && 'Tersimpan ✓'}
              {saveState === 'error' && 'Gagal — Coba Lagi'}
              {saveState === 'idle' && 'Simpan Perubahan'}
            </button>
          )}
        </div>

        {/* Step save shortcut — non-final steps */}
        {currentStep < 4 && (
          <div className="no-print px-4 sm:px-6 lg:px-8 pb-4">
            <button
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
              className="w-full px-5 py-2 rounded-xl text-xs font-medium border transition-colors disabled:opacity-50"
              style={{ borderColor: '#0F6E56', color: '#0F6E56', backgroundColor: '#ffffff' }}
            >
              {saveState === 'saving' && 'Menyimpan...'}
              {saveState === 'saved' && 'Tersimpan ✓'}
              {saveState === 'error' && 'Gagal — Coba Lagi'}
              {saveState === 'idle' && 'Simpan Perubahan Sekarang'}
            </button>
          </div>
        )}
      </div>

      {/* ── Right: Preview panel — hidden on mobile ───────────────────────────── */}
      <div
        className="preview-panel hidden lg:block w-full lg:w-[55%] lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#f1f5f9' }}
        data-print-target={printTarget}
      >
        <div
          className="no-print sticky top-0 z-10 px-4 py-3 border-b border-slate-200 flex items-center gap-3"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          <PrintButton
            printTarget={printTarget}
            onChangePrintTarget={setPrintTarget}
          />
        </div>
        <div className="preview-body p-4">
          <DocumentPreview data={formData} freelancer={freelancerData} printTarget={printTarget} />
        </div>
      </div>
    </main>
  );
}

export default function InvoiceDetailPage() {
  return (
    <Suspense fallback={null}>
      <InvoiceDetailInner />
    </Suspense>
  );
}
