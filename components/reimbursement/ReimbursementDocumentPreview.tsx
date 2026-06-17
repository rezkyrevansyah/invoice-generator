'use client';
import { useEffect, useRef, useState } from 'react';
import type { FreelancerData, ReimbursementOnlyFormData } from '@/lib/types';
import ReimbursementInvoicePage from './ReimbursementInvoicePage';

interface Props {
  data: ReimbursementOnlyFormData;
  freelancer: FreelancerData;
  imageFiles: File[];
}

export default function ReimbursementDocumentPreview({ data, freelancer, imageFiles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);

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

  useEffect(() => {
    const urls = imageFiles.map((f) => {
      const blobUrl = URL.createObjectURL(f);
      return f.type === 'application/pdf' ? `${blobUrl}#pdf` : blobUrl;
    });
    setBlobUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u.replace('#pdf', '')));
    };
  }, [imageFiles]);

  const previewImageUrls = [...blobUrls, ...data.imageUrls];

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div
        className="preview-scaler"
        style={{ zoom: scale, width: 794, transformOrigin: 'top left' }}
      >
        <ReimbursementInvoicePage
          data={data}
          freelancer={freelancer}
          previewImageUrls={previewImageUrls}
        />
      </div>
    </div>
  );
}
