'use client';
import { useEffect, useRef, useState } from 'react';
import type { FreelancerData, SettlementFormData } from '@/lib/types';
import SettlementInvoicePage from './SettlementInvoicePage';

interface Props {
  data: SettlementFormData;
  freelancer: FreelancerData;
  imageFiles: File[];
}

export default function SettlementDocumentPreview({ data, freelancer, imageFiles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);

  // Responsive zoom — same pattern as DocumentPreview
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(Math.min(1, w / 794));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Blob URLs for pending imageFiles preview
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setBlobUrls(urls);
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); };
  }, [imageFiles]);

  const previewImageUrls = [...blobUrls, ...data.imageUrls];

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div
        className="preview-scaler"
        style={{
          zoom: scale,
          width: 794,
          transformOrigin: 'top left',
        }}
      >
        <SettlementInvoicePage
          data={data}
          freelancer={freelancer}
          previewImageUrls={previewImageUrls}
        />
      </div>
    </div>
  );
}
