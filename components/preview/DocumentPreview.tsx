'use client';

import { useRef, useState, useEffect } from 'react';
import type { FreelancerData, InvoiceFormData } from '@/lib/types';
import type { PrintTarget } from '@/app/generator/page';
import InvoicePage from './InvoicePage';
import AgreementPage from './AgreementPage';

// A4 width at 96 dpi = 794px
const A4_WIDTH_PX = 794;

interface DocumentPreviewProps {
  data: InvoiceFormData;
  freelancer: FreelancerData;
  printTarget: PrintTarget;
}

export default function DocumentPreview({ data, freelancer, printTarget }: DocumentPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      // Only zoom out (≤1) — never zoom in beyond 100%
      setZoom(Math.min(1, el.clientWidth / A4_WIDTH_PX));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    // Outer: full-width measurement container
    <div ref={containerRef} className="preview-panel" data-print-target={printTarget}>
      {/*
        Inner: fixed A4 width, scaled via CSS zoom.
        zoom (unlike transform:scale) shrinks layout dimensions too,
        so no manual height compensation needed.
      */}
      <div
        className="preview-scaler"
        style={{ zoom: zoom, width: A4_WIDTH_PX }}
      >
        <InvoicePage data={data} freelancer={freelancer} />
        <div style={{ height: 16 }} /> {/* gap between page cards */}
        <AgreementPage data={data} freelancer={freelancer} />
      </div>
    </div>
  );
}
