'use client';
import type { FreelancerData, ReimbursementOnlyFormData } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import ReimbursementEditor from '@/components/settlement/ReimbursementEditor';
import ImageUploader from '@/components/settlement/ImageUploader';

interface Props {
  data: ReimbursementOnlyFormData;
  onChange: (field: keyof ReimbursementOnlyFormData, value: ReimbursementOnlyFormData[keyof ReimbursementOnlyFormData]) => void;
  freelancerData: FreelancerData;
  imageFiles: File[];
  onFilesChange: (files: File[]) => void;
  isUploading: boolean;
}

const INPUT_CLASS = 'w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white';
const INPUT_STYLE = { '--tw-ring-color': '#0F6E56' } as React.CSSProperties;
const LABEL_CLASS = 'block text-xs font-semibold text-slate-600 mb-1';

export default function ReimbursementFormPanel({
  data,
  onChange,
  imageFiles,
  onFilesChange,
  isUploading,
}: Props) {
  const total = data.reimbursementItems.reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Info Dokumen ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Info Dokumen</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Reimbursement Number</label>
            <input
              type="text"
              value={data.reimbursementNumber}
              onChange={(e) => onChange('reimbursementNumber', e.target.value)}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Tanggal</label>
            <input
              type="date"
              value={data.reimbursementDate}
              onChange={(e) => onChange('reimbursementDate', e.target.value)}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
          </div>
        </div>
      </section>

      {/* ── Info Client ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Info Client</h3>
        <div>
          <label className={LABEL_CLASS}>Nama Perusahaan</label>
          <input
            type="text"
            placeholder="PT Klien Makmur"
            value={data.clientCompany}
            onChange={(e) => onChange('clientCompany', e.target.value)}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Nama PIC</label>
          <input
            type="text"
            placeholder="Budi Santoso"
            value={data.clientPIC}
            onChange={(e) => onChange('clientPIC', e.target.value)}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
        </div>
      </section>

      {/* ── Keterangan Project ───────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</h3>
        <div>
          <label className={LABEL_CLASS}>Project / Keterangan</label>
          <input
            type="text"
            placeholder="Contoh: Survey lokasi client, Meeting awal project"
            value={data.projectName}
            onChange={(e) => onChange('projectName', e.target.value)}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
        </div>
      </section>

      {/* ── Reimbursement Items ──────────────────────────────────────────────── */}
      <section>
        <ReimbursementEditor
          items={data.reimbursementItems}
          onChange={(items) => onChange('reimbursementItems', items)}
        />
      </section>

      {/* Total summary */}
      {total > 0 && (
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-3 py-2 flex justify-between items-center" style={{ backgroundColor: '#E1F5EE' }}>
            <span className="text-xs font-bold" style={{ color: '#085041' }}>TOTAL REIMBURSEMENT</span>
            <span className="text-sm font-bold" style={{ color: '#0F6E56' }}>{formatRupiah(total)}</span>
          </div>
        </div>
      )}

      {/* ── Upload Bukti ─────────────────────────────────────────────────────── */}
      <section>
        <ImageUploader
          files={imageFiles}
          uploadedUrls={data.imageUrls}
          onFilesChange={onFilesChange}
          onRemoveUploaded={(url) => onChange('imageUrls', data.imageUrls.filter((u) => u !== url))}
          isUploading={isUploading}
        />
      </section>

    </div>
  );
}
