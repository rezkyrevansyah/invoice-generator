'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReimbursementOnlyDraft } from '@/lib/types';

const DRAFT_KEY = 'reimbursement-draft';
const DEBOUNCE_MS = 800;

export function useReimbursementDraft(): [
  ReimbursementOnlyDraft | null,
  (draft: Omit<ReimbursementOnlyDraft, 'savedAt'>) => void,
  () => void,
] {
  const [restoredDraft, setRestoredDraft] = useState<ReimbursementOnlyDraft | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setRestoredDraft(JSON.parse(raw) as ReimbursementOnlyDraft);
    } catch {
      // corrupt data, ignore
    }
  }, []);

  const saveDraft = useCallback((payload: Omit<ReimbursementOnlyDraft, 'savedAt'>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const draft: ReimbursementOnlyDraft = { ...payload, savedAt: new Date().toISOString() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setRestoredDraft(draft);
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

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return [restoredDraft, saveDraft, clearDraft];
}
