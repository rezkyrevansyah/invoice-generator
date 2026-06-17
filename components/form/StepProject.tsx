'use client';

import type { InvoiceFormData } from '@/lib/types';
import { formatRupiah, formatRupiahWords } from '@/lib/utils';

interface FormStepProps {
  data: InvoiceFormData;
  onChange: (field: keyof InvoiceFormData, value: string | number) => void;
}

export default function StepProject({ data, onChange }: FormStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Detail Project</h2>

      {/* Project Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nama Project <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.projectName}
          onChange={(e) => onChange('projectName', e.target.value)}
          placeholder="Nama Project"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      {/* Scope of Work */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Scope of Work</label>
        <textarea
          rows={3}
          value={data.scopeOfWork}
          onChange={(e) => onChange('scopeOfWork', e.target.value)}
          placeholder="Deskripsi ruang lingkup pekerjaan"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
        />
      </div>

      {/* Deliverables */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Deliverables</label>
        <textarea
          rows={3}
          value={data.deliverables}
          onChange={(e) => onChange('deliverables', e.target.value)}
          placeholder="List hasil yang akan diserahkan"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
        />
      </div>

      {/* Revision Rounds */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Jumlah Revisi</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={99}
            value={data.revisionRounds}
            onChange={(e) => onChange('revisionRounds', parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          />
          <span className="text-xs text-gray-500 whitespace-nowrap">kali revisi</span>
        </div>
      </div>

      {/* Start & End Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          />
        </div>
      </div>

      {/* Progress Update */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Frekuensi Progress Update</label>
        <input
          type="text"
          value={data.progressUpdate}
          onChange={(e) => onChange('progressUpdate', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
      </div>

      {/* Project Value */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nilai Project (Rp) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={0}
          value={data.projectValue || ''}
          onChange={(e) => onChange('projectValue', parseInt(e.target.value) || 0)}
          placeholder="1000000"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
        />
        {data.projectValue > 0 && (
          <div className="mt-1 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: '#E1F5EE', color: '#085041' }}>
            <span className="font-semibold">{formatRupiah(data.projectValue)}</span>
            <span className="ml-2 text-xs opacity-75">({formatRupiahWords(data.projectValue)})</span>
          </div>
        )}
      </div>
    </div>
  );
}
