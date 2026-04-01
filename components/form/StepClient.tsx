'use client';

import type { InvoiceFormData } from '@/lib/types';

interface FormStepProps {
  data: InvoiceFormData;
  onChange: (field: keyof InvoiceFormData, value: string) => void;
}

export default function StepClient({ data, onChange }: FormStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Info Client</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nama Perusahaan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.clientCompany}
          onChange={(e) => onChange('clientCompany', e.target.value)}
          placeholder="PT Nama Perusahaan"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nama PIC <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.clientPIC}
          onChange={(e) => onChange('clientPIC', e.target.value)}
          placeholder="Nama PIC / Contact Person"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>
    </div>
  );
}
