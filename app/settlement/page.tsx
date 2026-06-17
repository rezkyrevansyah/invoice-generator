'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SettlementFormPanel from '@/components/settlement/SettlementFormPanel';
import SettlementDocumentPreview from '@/components/settlement/SettlementDocumentPreview';
import DraftBanner from '@/components/DraftBanner';
import DraftIndicator from '@/components/DraftIndicator';
import PrintButton from '@/components/PrintButton';
import { useDownloadPdf } from '@/hooks/useDownloadPdf';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSettlementDraft } from '@/hooks/useSettlementDraft';
import { defaultFreelancerData, defaultSettlementFormData } from '@/lib/defaults';
import { generateSettlementNumber, validateSettlement } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import type { FreelancerData, SettlementFormData } from '@/lib/types';
import type { PrintTarget } from '@/app/generator/page';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface InvoiceOption {
  id: string;
  invoiceNumber: string;
  clientCompany: string;
  clientPIC: string;
  projectName: string;
  projectValue: number;
}

function SettlementPageInner() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id') ?? '';
  const settlementId = searchParams.get('settlementId') ?? '';
  const isViewMode = !!settlementId;

  const [formData, setFormData] = useState<SettlementFormData>(defaultSettlementFormData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [freelancerData] = useLocalStorage<FreelancerData>('freelancer-data', defaultFreelancerData);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [printTarget, setPrintTarget] = useState<PrintTarget>('invoice');
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceOptions, setInvoiceOptions] = useState<InvoiceOption[]>([]);

  const [restoredDraft, saveDraft, clearDraft] = useSettlementDraft();
  const [showBanner, setShowBanner] = useState(true);
  const shouldSaveDraft = useRef(false);
  const { downloadPdf, isGenerating } = useDownloadPdf();

  // Load existing settlement when settlementId is provided
  useEffect(() => {
    if (!settlementId) return;
    fetch(`/api/settlement/${settlementId}`)
      .then((r) => r.json())
      .then((data: SettlementFormData) => {
        setFormData(data);
        shouldSaveDraft.current = false;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settlementId]);

  // Prefill from original invoice via Supabase client-side fetch
  useEffect(() => {
    if (settlementId) return; // already loaded above
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

  // Fetch all invoices for reference dropdown
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('invoices')
      .select('id, invoice_number, client_company, client_pic, project_name, project_value')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setInvoiceOptions(data.map((r) => ({
          id: r.id,
          invoiceNumber: r.invoice_number,
          clientCompany: r.client_company,
          clientPIC: r.client_pic,
          projectName: r.project_name,
          projectValue: r.project_value ?? 0,
        })));
      });
  }, []);

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

  function handleSelectInvoice(opt: InvoiceOption) {
    shouldSaveDraft.current = true;
    const pv = opt.projectValue;
    setFormData((prev) => ({
      ...prev,
      originalInvoiceId: opt.id,
      originalInvoiceNumber: opt.invoiceNumber,
      clientCompany: opt.clientCompany,
      clientPIC: opt.clientPIC,
      projectName: opt.projectName,
      projectValue: pv,
      dpAmount: Math.floor(pv / 2),
      remainingAmount: Math.floor(pv / 2),
    }));
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
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Invoice Pelunasan</h1>
            {isViewMode
              ? <p className="text-xs text-slate-400">Detail Invoice Pelunasan</p>
              : restoredDraft && !showBanner
                ? <DraftIndicator savedAt={restoredDraft.savedAt} />
                : <p className="text-xs text-slate-400">Settlement Invoice</p>
            }
          </div>
        </div>

        {/* Draft restore banner — skip when viewing an existing settlement */}
        {!isViewMode && restoredDraft && showBanner && (
          <DraftBanner
            draft={{ ...restoredDraft, formData: restoredDraft.formData as unknown as import('@/lib/types').InvoiceFormData, currentStep: 1 }}
            onContinue={handleContinueDraft}
            onDiscard={handleDiscardDraft}
          />
        )}

        {/* Form content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          <SettlementFormPanel
            data={formData}
            onChange={handleChange}
            freelancerData={freelancerData}
            imageFiles={imageFiles}
            onFilesChange={setImageFiles}
            isUploading={isUploading}
            invoiceOptions={invoiceOptions}
            onSelectInvoice={handleSelectInvoice}
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

        {/* Save / status footer */}
        <div
          className="no-print sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-100"
          style={{ backgroundColor: '#ffffff' }}
        >
          {isViewMode ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {/* Print */}
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border"
                  style={{ borderColor: '#0F6E56', color: '#0F6E56', backgroundColor: '#fff' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                {/* Download PDF */}
                <button
                  onClick={() => downloadPdf('settlement', `settlement-${formData.settlementNumber || 'draft'}.pdf`)}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
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
              </div>
              <Link
                href="/history"
                className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
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
            </>
          )}
        </div>
      </div>

      {/* ── Right: Preview panel — hidden on mobile ───────────────────────────── */}
      <div
        className="preview-panel hidden lg:block print:block w-full lg:w-[55%] lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto"
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
            variant="settlement"
            filename={`settlement-${formData.settlementNumber || 'draft'}.pdf`}
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
