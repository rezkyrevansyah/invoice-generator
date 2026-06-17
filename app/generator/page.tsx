'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Stepper from '@/components/Stepper';
import StepInfo from '@/components/form/StepInfo';
import StepClient from '@/components/form/StepClient';
import StepProject from '@/components/form/StepProject';
import StepPayment from '@/components/form/StepPayment';
import DocumentPreview from '@/components/preview/DocumentPreview';
import PrintButton from '@/components/PrintButton';
import DraftBanner from '@/components/DraftBanner';
import DraftIndicator from '@/components/DraftIndicator';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDraft } from '@/hooks/useDraft';
import { defaultFormData, defaultFreelancerData } from '@/lib/defaults';
import { validateStep } from '@/lib/utils';
import type { FreelancerData, InvoiceFormData } from '@/lib/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export type PrintTarget = 'both' | 'invoice' | 'agreement';

export default function GeneratorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData);
  const [freelancerData, setFreelancerData] = useLocalStorage<FreelancerData>(
    'freelancer-data',
    defaultFreelancerData
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [printTarget, setPrintTarget] = useState<PrintTarget>('both');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [savedId, setSavedId] = useState<string | null>(null);

  const [restoredDraft, saveDraft, clearDraft] = useDraft();
  const [showBanner, setShowBanner] = useState(true);
  // Guard: don't write draft on initial mount with blank default state
  const shouldSaveDraft = useRef(false);

  // Auto-save effect — fires when formData or currentStep changes
  useEffect(() => {
    if (!shouldSaveDraft.current) return;
    saveDraft({ formData, currentStep });
  }, [formData, currentStep, saveDraft]);

  function handleChange(
    field: keyof InvoiceFormData,
    value: InvoiceFormData[keyof InvoiceFormData]
  ) {
    shouldSaveDraft.current = true;
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleUpdateFreelancer(data: FreelancerData) {
    setFreelancerData(data);
  }

  function handleNext() {
    const errs = validateStep(currentStep, formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    if (currentStep < 4) {
      shouldSaveDraft.current = true;
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setErrors([]);
    shouldSaveDraft.current = true;
    setCurrentStep((prev) => prev - 1);
  }

  function handleContinueDraft() {
    if (!restoredDraft) return;
    setFormData(restoredDraft.formData);
    setCurrentStep(restoredDraft.currentStep);
    setShowBanner(false);
    shouldSaveDraft.current = true;
  }

  function handleDiscardDraft() {
    clearDraft();
    setShowBanner(false);
    shouldSaveDraft.current = true;
  }

  async function handleSave() {
    const errs = validateStep(4, formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setSaveState('saving');
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menyimpan');
      setSavedId(json.id);
      setSaveState('saved');
      clearDraft();
      shouldSaveDraft.current = false;
    } catch {
      setSaveState('error');
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* ── Left: Form panel ──────────────────────────────────────────────────── */}
      <div
        className="form-panel no-print w-full lg:w-[45%] flex flex-col min-h-screen lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Header bar */}
        <div
          className="sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-100 flex items-center gap-3"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Invoice Generator</h1>
            {restoredDraft && !showBanner
              ? <DraftIndicator savedAt={restoredDraft.savedAt} />
              : <p className="text-xs text-slate-400">Freelance Invoice &amp; Work Agreement</p>
            }
          </div>
        </div>

        {/* Draft restore banner */}
        {restoredDraft && showBanner && (
          <DraftBanner
            draft={restoredDraft}
            onContinue={handleContinueDraft}
            onDiscard={handleDiscardDraft}
          />
        )}

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

        {/* Navigation buttons */}
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
              style={{ backgroundColor: saveState === 'saved' ? '#16a34a' : saveState === 'error' ? '#dc2626' : '#0F6E56' }}
            >
              {saveState === 'saving' && 'Menyimpan...'}
              {saveState === 'saved' && 'Tersimpan ✓'}
              {saveState === 'error' && 'Gagal — Coba Lagi'}
              {saveState === 'idle' && 'Simpan Invoice'}
            </button>
          )}
        </div>

        {/* Link ke History setelah save sukses */}
        {saveState === 'saved' && (
          <div className="no-print px-4 sm:px-6 lg:px-8 pb-4">
            <Link
              href="/history"
              className="block w-full text-center px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
              style={{ borderColor: '#0F6E56', color: '#0F6E56' }}
            >
              Lihat History Invoice →
            </Link>
          </div>
        )}
      </div>

      {/* ── Right: Preview panel — hidden on mobile ───────────────────────────── */}
      <div
        className="preview-panel hidden lg:block print:block w-full lg:w-[55%] lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#f1f5f9' }}
        data-print-target={printTarget}
      >
        {/* Preview toolbar */}
        <div
          className="no-print sticky top-0 z-10 px-4 py-3 border-b border-slate-200 flex items-center gap-3"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          <PrintButton
            printTarget={printTarget}
            onChangePrintTarget={setPrintTarget}
            filename={`invoice-${formData.invoiceNumber || 'draft'}.pdf`}
          />
        </div>

        <div className="preview-body p-4">
          <DocumentPreview data={formData} freelancer={freelancerData} printTarget={printTarget} />
        </div>
      </div>
    </main>
  );
}
