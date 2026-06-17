'use client';
import type { FreelancerData, SettlementFormData } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import ReimbursementEditor from './ReimbursementEditor';
import ImageUploader from './ImageUploader';
import type { InvoiceOption } from '@/app/settlement/page';

interface Props {
  data: SettlementFormData;
  onChange: (field: keyof SettlementFormData, value: SettlementFormData[keyof SettlementFormData]) => void;
  freelancerData: FreelancerData;
  imageFiles: File[];
  onFilesChange: (files: File[]) => void;
  isUploading: boolean;
  invoiceOptions: InvoiceOption[];
  onSelectInvoice: (opt: InvoiceOption) => void;
}

const INPUT_CLASS = 'w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white';
const INPUT_STYLE = { '--tw-ring-color': '#0F6E56' } as React.CSSProperties;

const LABEL_CLASS = 'block text-xs font-semibold text-slate-600 mb-1';

export default function SettlementFormPanel({
  data,
  onChange,
  imageFiles,
  onFilesChange,
  isUploading,
  invoiceOptions,
  onSelectInvoice,
}: Props) {
  const reimbursementTotal = data.reimbursementItems.reduce((s, i) => s + (i.amount || 0), 0);
  const grandTotal = data.remainingAmount + reimbursementTotal;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Info Dokumen ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Info Dokumen</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Settlement Number</label>
            <input
              type="text"
              value={data.settlementNumber}
              onChange={(e) => onChange('settlementNumber', e.target.value)}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Tanggal</label>
            <input
              type="date"
              value={data.settlementDate}
              onChange={(e) => onChange('settlementDate', e.target.value)}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Nomor Invoice Referensi</label>
          {invoiceOptions.length > 0 && (
            <select
              value={data.originalInvoiceId || ''}
              onChange={(e) => {
                const opt = invoiceOptions.find((o) => o.id === e.target.value);
                if (opt) onSelectInvoice(opt);
                else {
                  onChange('originalInvoiceId', '');
                  onChange('originalInvoiceNumber', '');
                }
              }}
              className={INPUT_CLASS + ' mb-2'}
              style={INPUT_STYLE}
            >
              <option value="">— Pilih dari history atau isi manual —</option>
              {invoiceOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.invoiceNumber} · {opt.clientCompany}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="INV/2026/06/001"
            value={data.originalInvoiceNumber}
            onChange={(e) => {
              onChange('originalInvoiceId', '');
              onChange('originalInvoiceNumber', e.target.value);
            }}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
          {data.originalInvoiceId && (
            <p className="text-xs text-slate-400 mt-1">
              Dipilih dari history · nomor bisa diedit manual di atas
            </p>
          )}
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

      {/* ── Detail Project ───────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detail Project</h3>

        <div>
          <label className={LABEL_CLASS}>Nama Project</label>
          <input
            type="text"
            placeholder="Landing Page Redesign"
            value={data.projectName}
            onChange={(e) => onChange('projectName', e.target.value)}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Total Nilai Project (Rp)</label>
          <input
            type="number"
            min={0}
            placeholder="10000000"
            value={data.projectValue || ''}
            onChange={(e) => {
              const val = Number(e.target.value);
              const dp = Math.floor(val / 2);
              onChange('projectValue', val);
              onChange('dpAmount', dp);
              onChange('remainingAmount', val - dp);
            }}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
          {data.projectValue > 0 && (
            <p className="text-xs text-slate-500 mt-1">{formatRupiah(data.projectValue)}</p>
          )}
        </div>

        {data.projectValue > 0 && (
          <div>
            <label className={LABEL_CLASS}>
              DP yang Telah Dibayar (Rp)
              <span className="ml-1 font-normal text-slate-400">— bisa diubah sesuai pembayaran aktual</span>
            </label>
            <input
              type="number"
              min={0}
              max={data.projectValue}
              placeholder="0"
              value={data.dpAmount || ''}
              onChange={(e) => {
                const dp = Math.min(Number(e.target.value), data.projectValue);
                onChange('dpAmount', dp);
                onChange('remainingAmount', data.projectValue - dp);
              }}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
            {data.dpAmount > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {formatRupiah(data.dpAmount)}
                {data.projectValue > 0 && (
                  <span className="ml-1 text-slate-400">
                    ({Math.round((data.dpAmount / data.projectValue) * 100)}% dari total)
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Ringkasan pembayaran */}
        {data.projectValue > 0 && (
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-3 py-2 flex justify-between items-center border-b border-slate-100">
              <span className="text-xs text-slate-500">Total Nilai Project</span>
              <span className="text-xs font-medium text-slate-700">{formatRupiah(data.projectValue)}</span>
            </div>
            <div className="px-3 py-2 flex justify-between items-center border-b border-slate-100">
              <span className="text-xs text-slate-400">
                DP Telah Dibayar
                {data.projectValue > 0 && data.dpAmount > 0 && (
                  <span className="ml-1">({Math.round((data.dpAmount / data.projectValue) * 100)}%)</span>
                )}
              </span>
              <span className="text-xs text-slate-400">({formatRupiah(data.dpAmount)})</span>
            </div>
            <div className="px-3 py-2 flex justify-between items-center border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                Sisa Pelunasan
                {data.projectValue > 0 && data.remainingAmount > 0 && (
                  <span className="ml-1 font-normal">({Math.round((data.remainingAmount / data.projectValue) * 100)}%)</span>
                )}
              </span>
              <span className="text-xs font-semibold text-slate-700">{formatRupiah(data.remainingAmount)}</span>
            </div>
            {reimbursementTotal > 0 && (
              <div className="px-3 py-2 flex justify-between items-center border-b border-slate-100">
                <span className="text-xs text-slate-500">Subtotal Reimbursement</span>
                <span className="text-xs text-slate-500">{formatRupiah(reimbursementTotal)}</span>
              </div>
            )}
            <div className="px-3 py-2 flex justify-between items-center" style={{ backgroundColor: '#E1F5EE' }}>
              <span className="text-xs font-bold" style={{ color: '#085041' }}>TOTAL TAGIHAN</span>
              <span className="text-sm font-bold" style={{ color: '#0F6E56' }}>{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        )}
      </section>

      {/* ── Reimbursement ────────────────────────────────────────────────────── */}
      <section>
        <ReimbursementEditor
          items={data.reimbursementItems}
          onChange={(items) => onChange('reimbursementItems', items)}
        />
      </section>

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
