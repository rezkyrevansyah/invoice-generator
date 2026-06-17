'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReimbursementFormPanel from '@/components/reimbursement/ReimbursementFormPanel';
import ReimbursementDocumentPreview from '@/components/reimbursement/ReimbursementDocumentPreview';
import DraftBanner from '@/components/DraftBanner';
import DraftIndicator from '@/components/DraftIndicator';
import PrintButton from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useReimbursementDraft } from '@/hooks/useReimbursementDraft';
import { useDownloadPdf } from '@/hooks/useDownloadPdf';
import { defaultFreelancerData, defaultReimbursementFormData } from '@/lib/defaults';
import { generateReimbursementNumber, validateReimbursement } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import type { FreelancerData, ReimbursementOnlyFormData, InvoiceFormData } from '@/lib/types';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function ReimbursementPageInner() {
  const searchParams = useSearchParams();
  const reimbursementId = searchParams.get('reimbursementId') ?? '';
  const isViewMode = !!reimbursementId;

  const [formData, setFormData] = useState<ReimbursementOnlyFormData>(defaultReimbursementFormData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [freelancerData] = useLocalStorage<FreelancerData>('freelancer-data', defaultFreelancerData);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [isUploading, setIsUploading] = useState(false);

  const [restoredDraft, saveDraft, clearDraft] = useReimbursementDraft();
  const [showBanner, setShowBanner] = useState(true);
  const shouldSaveDraft = useRef(false);
  const { downloadPdf, isGenerating } = useDownloadPdf();

  // Load existing reimbursement when reimbursementId is provided
  useEffect(() => {
    if (!reimbursementId) return;
    fetch(`/api/reimbursement/${reimbursementId}`)
      .then((r) => r.json())
      .then((data: ReimbursementOnlyFormData) => {
        setFormData(data);
        shouldSaveDraft.current = false;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reimbursementId]);

  // Set defaults for new reimbursement
  useEffect(() => {
    if (reimbursementId) return;
    setFormData((prev) => ({
      ...prev,
      reimbursementNumber: prev.reimbursementNumber || generateReimbursementNumber(new Date()),
      bank: freelancerData.bank,
      accountNumber: freelancerData.accountNumber,
      accountName: freelancerData.accountName,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (!shouldSaveDraft.current) return;
    saveDraft({ formData });
  }, [formData, saveDraft]);

  function handleChange(
    field: keyof ReimbursementOnlyFormData,
    value: ReimbursementOnlyFormData[keyof ReimbursementOnlyFormData]
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
    const errs = validateReimbursement(formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setSaveState('saving');

    try {
      // 1. Upload images
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

      // 2. Compute total
      const reimbursementTotal = formData.reimbursementItems.reduce((s, i) => s + i.amount, 0);

      // 3. Save to DB
      const res = await fetch('/api/reimbursement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrls: uploadedUrls, reimbursementTotal }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Gagal menyimpan');

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
        className="form-panel no-print w-full lg:w-[45%] flex flex-col min-h-screen lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-100 flex items-center gap-3"
          style={{ backgroundColor: '#ffffff' }}
        >
          <Link href="/history" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#7C3AED' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Reimbursement</h1>
            {isViewMode
              ? <p className="text-xs text-slate-400">Detail Reimbursement</p>
              : restoredDraft && !showBanner
                ? <DraftIndicator savedAt={restoredDraft.savedAt} />
                : <p className="text-xs text-slate-400">Reimbursement Invoice</p>
            }
          </div>
        </div>

        {/* Draft banner — skip in view mode */}
        {!isViewMode && restoredDraft && showBanner && (
          <DraftBanner
            draft={{ ...restoredDraft, formData: restoredDraft.formData as unknown as InvoiceFormData, currentStep: 1 }}
            onContinue={handleContinueDraft}
            onDiscard={handleDiscardDraft}
          />
        )}

        {/* Form */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          <ReimbursementFormPanel
            data={formData}
            onChange={handleChange}
            freelancerData={freelancerData}
            imageFiles={imageFiles}
            onFilesChange={setImageFiles}
            isUploading={isUploading}
          />
        </div>

        {/* Errors */}
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

        {/* Footer */}
        <div
          className="no-print sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-100"
          style={{ backgroundColor: '#ffffff' }}
        >
          {isViewMode ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border"
                  style={{ borderColor: '#7C3AED', color: '#7C3AED', backgroundColor: '#fff' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => downloadPdf('reimbursement', `reimbursement-${formData.reimbursementNumber || 'draft'}.pdf`)}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#7C3AED' }}
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
              </div>
              <Link href="/history" className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
                ← Kembali ke History
              </Link>
            </div>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saveState === 'saving' || saveState === 'saved' || isUploading}
                className="w-full px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    saveState === 'saved' ? '#16a34a'
                    : saveState === 'error' ? '#dc2626'
                    : '#7C3AED',
                }}
              >
                {isUploading && 'Mengupload file...'}
                {!isUploading && saveState === 'idle' && 'Simpan Reimbursement'}
                {!isUploading && saveState === 'saving' && 'Menyimpan...'}
                {!isUploading && saveState === 'saved' && 'Tersimpan ✓'}
                {!isUploading && saveState === 'error' && 'Gagal — Coba Lagi'}
              </button>
              {saveState === 'saved' && (
                <Link href="/history" className="block mt-2 text-center text-sm text-slate-500 hover:text-slate-700 transition-colors">
                  ← Kembali ke History
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Right: Preview panel ──────────────────────────────────────────────── */}
      <div
        className="preview-panel hidden lg:block print:block w-full lg:w-[55%] lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
        style={{ backgroundColor: '#f1f5f9' }}
      >
        <div
          className="no-print sticky top-0 z-10 px-4 py-3 border-b border-slate-200 flex items-center gap-3"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          <PrintButton
            printTarget="invoice"
            onChangePrintTarget={() => {}}
            variant="reimbursement"
            filename={`reimbursement-${formData.reimbursementNumber || 'draft'}.pdf`}
          />
        </div>
        <div className="preview-body p-4">
          <ReimbursementDocumentPreview
            data={formData}
            freelancer={freelancerData}
            imageFiles={imageFiles}
          />
        </div>
      </div>
    </main>
  );
}

export default function ReimbursementPage() {
  return (
    <Suspense fallback={null}>
      <ReimbursementPageInner />
    </Suspense>
  );
}
