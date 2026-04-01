'use client';

import { useState } from 'react';
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

  function handleChange(
    field: keyof InvoiceFormData,
    value: InvoiceFormData[keyof InvoiceFormData]
  ) {
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
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setErrors([]);
    setCurrentStep((prev) => prev - 1);
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* ── Left: Form panel ──────────────────────────────────────────────────── */}
      <div
        className="form-panel no-print w-full lg:w-[45%] flex flex-col lg:min-h-screen lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Header bar */}
        <div
          className="px-6 lg:px-8 py-4 border-b border-slate-100 flex items-center gap-3"
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
            <p className="text-xs text-slate-400">Freelance Invoice & Work Agreement</p>
          </div>
        </div>

        {/* Stepper + Form content */}
        <div className="flex-1 px-6 lg:px-8 py-6 flex flex-col gap-6">
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
          className="no-print px-6 lg:px-8 py-4 flex gap-3 border-t border-slate-100"
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

          <button
            onClick={handleNext}
            disabled={currentStep === 4}
            className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0F6E56' }}
          >
            {currentStep < 4 ? 'Lanjut →' : 'Selesai'}
          </button>
        </div>
      </div>

      {/* ── Right: Preview panel ──────────────────────────────────────────────── */}
      <div
        className="preview-panel w-full lg:w-[55%] lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
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
          />
        </div>

        <div className="preview-body p-4">
          <DocumentPreview data={formData} freelancer={freelancerData} printTarget={printTarget} />
        </div>
      </div>
    </main>
  );
}
