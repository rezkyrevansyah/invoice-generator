'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { SettlementDraft } from '@/lib/types';

const DRAFT_KEY = 'settlement-draft';
const DEBOUNCE_MS = 800;

export function useSettlementDraft(): [
  SettlementDraft | null,
  (draft: Omit<SettlementDraft, 'savedAt'>) => void,
  () => void,
] {
  const [restoredDraft, setRestoredDraft] = useState<SettlementDraft | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SSR-safe: read after mount only
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setRestoredDraft(JSON.parse(raw) as SettlementDraft);
    } catch {
      // corrupt data, ignore
    }
  }, []);

  const saveDraft = useCallback((payload: Omit<SettlementDraft, 'savedAt'>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const draft: SettlementDraft = { ...payload, savedAt: new Date().toISOString() };
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
