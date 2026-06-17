'use client';
import { useState, useEffect } from 'react';

interface Props {
  savedAt: string;
}

export default function DraftIndicator({ savedAt }: Props) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    function compute() {
      const diff = Math.floor((Date.now() - new Date(savedAt).getTime()) / 60000);
      setLabel(diff < 1 ? 'Draft tersimpan · baru saja' : `Draft tersimpan · ${diff} menit lalu`);
    }
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [savedAt]);

  if (!label) return null;
  return <p className="text-xs text-slate-400">{label}</p>;
}
