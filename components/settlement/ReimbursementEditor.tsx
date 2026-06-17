'use client';
import type { ReimbursementItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

interface Props {
  items: ReimbursementItem[];
  onChange: (items: ReimbursementItem[]) => void;
}

export default function ReimbursementEditor({ items, onChange }: Props) {
  function addItem() {
    onChange([
      ...items,
      { id: crypto.randomUUID(), description: '', amount: 0 },
    ]);
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function updateItem(id: string, field: 'description' | 'amount', value: string | number) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  const subtotal = items.reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          Reimbursement <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        <button
          type="button"
          onClick={addItem}
          className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0F6E56' }}
        >
          + Tambah Item
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-3 border border-dashed border-slate-200 rounded-xl">
          Belum ada item reimbursement
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex gap-2 items-start p-3 rounded-xl border border-slate-100"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-2 text-xs font-bold text-white"
            style={{ backgroundColor: '#0F6E56' }}>
            {index + 1}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Deskripsi (contoh: Gojek ke lokasi client)"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ '--tw-ring-color': '#0F6E56' } as React.CSSProperties}
            />
            <input
              type="number"
              placeholder="Nominal (Rp)"
              min={0}
              value={item.amount || ''}
              onChange={(e) => updateItem(item.id, 'amount', Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ '--tw-ring-color': '#0F6E56' } as React.CSSProperties}
            />
            {item.amount > 0 && (
              <p className="text-xs text-slate-500">{formatRupiah(item.amount)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="flex-shrink-0 mt-2 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Hapus item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <div className="flex justify-between items-center px-3 py-2 rounded-xl border border-slate-200 bg-white">
          <span className="text-xs font-semibold text-slate-600">Subtotal Reimbursement</span>
          <span className="text-sm font-bold" style={{ color: '#0F6E56' }}>
            {formatRupiah(subtotal)}
          </span>
        </div>
      )}
    </div>
  );
}
