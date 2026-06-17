'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { InvoiceDraft } from '@/lib/types';

const DRAFT_KEY = 'invoice-draft';
const DEBOUNCE_MS = 800;

export function useDraft(): [
  InvoiceDraft | null,
  (draft: Omit<InvoiceDraft, 'savedAt'>) => void,
  () => void,
] {
  const [restoredDraft, setRestoredDraft] = useState<InvoiceDraft | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SSR-safe: read after mount only
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setRestoredDraft(JSON.parse(raw) as InvoiceDraft);
    } catch {
      // corrupt data, ignore
    }
  }, []);

  const saveDraft = useCallback((payload: Omit<InvoiceDraft, 'savedAt'>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const draft: InvoiceDraft = { ...payload, savedAt: new Date().toISOString() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setRestoredDraft(draft); // refresh timestamp for indicator
      } catch {
        // QuotaExceededError, ignore
      }
    }, DEBOUNCE_MS);
  }, []);

  const clearDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setRestoredDraft(null);
  }, []);

  // Cleanup pending timer on unmount
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return [restoredDraft, saveDraft, clearDraft];
}
