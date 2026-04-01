'use client';

import { useEffect, useState } from 'react';
import type { InvoiceFormData } from '@/lib/types';
import { generateInvoiceNumber, generateAgreementNumber } from '@/lib/utils';

interface FormStepProps {
  data: InvoiceFormData;
  onChange: (field: keyof InvoiceFormData, value: string) => void;
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const result = new Date(y, m - 1, d + days);
  return result.toISOString().split('T')[0];
}

export default function StepInfo({ data, onChange }: FormStepProps) {
  const [editingInvoice, setEditingInvoice] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState(false);

  // Auto-generate nomor saat mount, hanya jika belum ada
  useEffect(() => {
    if (!data.invoiceNumber) {
      onChange('invoiceNumber', generateInvoiceNumber(new Date()));
    }
    if (!data.agreementNumber) {
      onChange('agreementNumber', generateAgreementNumber(new Date()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-update initialPaymentDue saat invoiceDate berubah
  useEffect(() => {
    if (data.invoiceDate) {
      onChange('initialPaymentDue', addDays(data.invoiceDate, 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.invoiceDate]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Info Dokumen</h2>

      {/* Invoice Number */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Invoice Number</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.invoiceNumber}
            readOnly={!editingInvoice}
            onChange={(e) => onChange('invoiceNumber', e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
            style={{ focusRingColor: '#0F6E56' } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={() => setEditingInvoice((v) => !v)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            title={editingInvoice ? 'Kunci' : 'Edit'}
          >
            {editingInvoice ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 16H7v-2a2 2 0 01.586-1.414L9 11z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Agreement Number */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Agreement Number</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.agreementNumber}
            readOnly={!editingAgreement}
            onChange={(e) => onChange('agreementNumber', e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
          />
          <button
            type="button"
            onClick={() => setEditingAgreement((v) => !v)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            title={editingAgreement ? 'Kunci' : 'Edit'}
          >
            {editingAgreement ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 16H7v-2a2 2 0 01.586-1.414L9 11z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Date */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tanggal Invoice</label>
        <input
          type="date"
          value={data.invoiceDate}
          onChange={(e) => onChange('invoiceDate', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      {/* Agreement Date */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tanggal Agreement</label>
        <input
          type="date"
          value={data.agreementDate}
          onChange={(e) => onChange('agreementDate', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      {/* Initial Payment Due */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Jatuh Tempo Pembayaran Awal
          <span className="ml-1 text-xs font-normal text-gray-400">(otomatis +1 hari dari tgl invoice)</span>
        </label>
        <input
          type="date"
          value={data.initialPaymentDue}
          onChange={(e) => onChange('initialPaymentDue', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      {/* Project Deadline */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Deadline Project</label>
        <input
          type="date"
          value={data.projectDeadline}
          onChange={(e) => onChange('projectDeadline', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>
    </div>
  );
}
