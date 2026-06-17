'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SettlementFormPanel from '@/components/settlement/SettlementFormPanel';
import SettlementDocumentPreview from '@/components/settlement/SettlementDocumentPreview';
import DraftBanner from '@/components/DraftBanner';
import DraftIndicator from '@/components/DraftIndicator';
import PrintButton from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettlementDraft } from '@/hooks/useSettlementDraft';
import { defaultFreelancerData, defaultSettlementFormData } from '@/lib/defaults';
import { generateSettlementNumber, validateSettlement } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import type { FreelancerData, SettlementFormData } from '@/lib/types';
import type { PrintTarget } from '@/app/generator/page';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function SettlementPageInner() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id') ?? '';

  const [formData, setFormData] = useState<SettlementFormData>(defaultSettlementFormData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [freelancerData] = useLocalStorage<FreelancerData>('freelancer-data', defaultFreelancerData);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [printTarget, setPrintTarget] = useState<PrintTarget>('invoice');
  const [isUploading, setIsUploading] = useState(false);

  const [restoredDraft, saveDraft, clearDraft] = useSettlementDraft();
  const [showBanner, setShowBanner] = useState(true);
  const shouldSaveDraft = useRef(false);

  // Prefill from original invoice via Supabase client-side fetch
  useEffect(() => {
    if (!invoiceId) {
      // No invoice id — generate settlement number and use defaults
      setFormData((prev) => ({
        ...prev,
        settlementNumber: generateSettlementNumber(new Date()),
        bank: freelancerData.bank,
        accountNumber: freelancerData.accountNumber,
        accountName: freelancerData.accountName,
      }));
      return;
    }

    const supabase = createClient();
    supabase
      .from('invoices')
      .select('id, invoice_number, client_company, client_pic, project_name, project_value')
      .eq('id', invoiceId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const pv = data.project_value ?? 0;
        setFormData((prev) => ({
          ...prev,
          settlementNumber: prev.settlementNumber || generateSettlementNumber(new Date()),
          originalInvoiceId: data.id,
          originalInvoiceNumber: data.invoice_number,
          clientCompany: data.client_company,
          clientPIC: data.client_pic,
          projectName: data.project_name,
          projectValue: pv,
          dpAmount: Math.floor(pv / 2),
          remainingAmount: Math.floor(pv / 2),
          bank: freelancerData.bank,
          accountNumber: freelancerData.accountNumber,
          accountName: freelancerData.accountName,
        }));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  // Auto-save draft
  useEffect(() => {
    if (!shouldSaveDraft.current) return;
    saveDraft({ formData });
  }, [formData, saveDraft]);

  function handleChange(
    field: keyof SettlementFormData,
    value: SettlementFormData[keyof SettlementFormData]
  ) {
    shouldSaveDraft.current = true;
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleContinueDraft() {
    if (!restoredDraft) return;
    setFormData(restoredDraft.formData);
    setShowBanner(false);
    shouldSaveDraft.current = true;
  }

  function handleDiscardDraft() {
    clearDraft();
    setShowBanner(false);
    shouldSaveDraft.current = true;
  }

  async function handleSave() {
    const errs = validateSettlement(formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setSaveState('saving');

    try {
      // 1. Upload images (if any)
      const uploadedUrls: string[] = [...formData.imageUrls];
      if (imageFiles.length > 0) {
        setIsUploading(true);
        const supabase = createClient();
        for (const file of imageFiles) {
          const ext = file.name.split('.').pop() ?? 'jpg';
          const path = `reimbursements/${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('invoice-bucket')
            .upload(path, file, { contentType: file.type });
          if (uploadError) throw new Error(uploadError.message);
          const { data: urlData } = supabase.storage
            .from('invoice-bucket')
            .getPublicUrl(path);
          uploadedUrls.push(urlData.publicUrl);
        }
        setIsUploading(false);
      }

      // 2. Compute totals
      const reimbursementTotal = formData.reimbursementItems.reduce((s, i) => s + i.amount, 0);
      const grandTotal = formData.remainingAmount + reimbursementTotal;

      // 3. Save to DB
      const res = await fetch('/api/settlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls: uploadedUrls,
          reimbursementTotal,
          grandTotal,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menyimpan');

      // 4. Update state
      setFormData((prev) => ({ ...prev, imageUrls: uploadedUrls }));
      setImageFiles([]);
      clearDraft();
      shouldSaveDraft.current = false;
      setSaveState('saved');
    } catch {
      setIsUploading(false);
      setSaveState('error');
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* ── Left: Form panel ──────────────────────────────────────────────────── */}
      <div
        className="form-panel no-print w-full lg:w-[45%] flex flex-col lg:min-h-screen lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Header */}
        <div
          className="px-6 lg:px-8 py-4 border-b border-slate-100 flex items-center gap-3"
          style={{ backgroundColor: '#ffffff' }}
        >
          <Link href="/history" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
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
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Invoice Pelunasan</h1>
            {restoredDraft && !showBanner
              ? <DraftIndicator savedAt={restoredDraft.savedAt} />
              : <p className="text-xs text-slate-400">Settlement Invoice</p>
            }
          </div>
        </div>

        {/* Draft restore banner */}
        {restoredDraft && showBanner && (
          <DraftBanner
            draft={{ ...restoredDraft, formData: restoredDraft.formData as unknown as import('@/lib/types').InvoiceFormData, currentStep: 1 }}
            onContinue={handleContinueDraft}
            onDiscard={handleDiscardDraft}
          />
        )}

        {/* Form content */}
        <div className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto">
          <SettlementFormPanel
            data={formData}
            onChange={handleChange}
            freelancerData={freelancerData}
            imageFiles={imageFiles}
            onFilesChange={setImageFiles}
            isUploading={isUploading}
          />
        </div>

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="px-6 lg:px-8 pb-2">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              {errors.map((e, i) => (
                <p key={i} className="text-sm text-red-600 flex items-start gap-1.5">
                  <span className="mt-0.5 flex-shrink-0">&#x26A0;</span>
                  {e}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        <div
          className="no-print px-6 lg:px-8 py-4 border-t border-slate-100"
          style={{ backgroundColor: '#ffffff' }}
        >
          <button
            onClick={handleSave}
            disabled={saveState === 'saving' || saveState === 'saved' || isUploading}
            className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                saveState === 'saved' ? '#16a34a'
                : saveState === 'error' ? '#dc2626'
                : '#0F6E56',
            }}
          >
            {isUploading && 'Mengupload gambar...'}
            {!isUploading && saveState === 'idle' && 'Simpan Invoice Pelunasan'}
            {!isUploading && saveState === 'saving' && 'Menyimpan...'}
            {!isUploading && saveState === 'saved' && 'Tersimpan ✓'}
            {!isUploading && saveState === 'error' && 'Gagal — Coba Lagi'}
          </button>
          {saveState === 'saved' && (
            <Link
              href="/history"
              className="block mt-2 text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Kembali ke History
            </Link>
          )}
        </div>
      </div>

      {/* ── Right: Preview panel ──────────────────────────────────────────────── */}
      <div
        className="preview-panel w-full lg:w-[55%] lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
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
          <SettlementDocumentPreview
            data={formData}
            freelancer={freelancerData}
            imageFiles={imageFiles}
          />
        </div>
      </div>
    </main>
  );
}

export default function SettlementPage() {
  return (
    <Suspense fallback={null}>
      <SettlementPageInner />
    </Suspense>
  );
}
