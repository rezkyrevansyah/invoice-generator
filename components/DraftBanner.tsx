'use client';
import { useState, useEffect } from 'react';
import type { InvoiceDraft } from '@/lib/types';

interface Props {
  draft: InvoiceDraft;
  onContinue: () => void;
  onDiscard: () => void;
}

export default function DraftBanner({ draft, onContinue, onDiscard }: Props) {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    function compute() {
      const diff = Math.floor((Date.now() - new Date(draft.savedAt).getTime()) / 60000);
      setRelativeTime(diff < 1 ? 'baru saja' : `${diff} menit lalu`);
    }
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [draft.savedAt]);

  return (
    <div
      role="alert"
      className="mx-6 lg:mx-8 mt-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3"
    >
      <p className="text-sm text-amber-800 font-medium">
        Draft ditemukan &middot;{' '}
        <span className="font-normal">{relativeTime}</span>
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onDiscard}
          className="text-xs px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
        >
          Mulai Baru
        </button>
        <button
          onClick={onContinue}
          className="text-xs px-3 py-1.5 rounded-lg text-white font-semibold"
          style={{ backgroundColor: '#0F6E56' }}
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
