'use client';
import { useState } from 'react';
import type { PrintTarget } from '@/app/generator/page';

export function useDownloadPdf() {
  const [isGenerating, setIsGenerating] = useState(false);

  async function downloadPdf(target: PrintTarget | 'settlement', filename = 'document.pdf') {
    setIsGenerating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js') as any).default;

      const opts = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, width: 794, windowWidth: 794 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      if (target === 'invoice') {
        const el = document.querySelector('.invoice-page') as HTMLElement;
        await html2pdf().set(opts).from(el).save();
      } else if (target === 'agreement') {
        const el = document.querySelector('.agreement-page') as HTMLElement;
        await html2pdf().set(opts).from(el).save();
      } else if (target === 'settlement') {
        const el = document.querySelector('.settlement-invoice-page') as HTMLElement;
        await html2pdf().set(opts).from(el).save();
      } else {
        // 'both' — clone ke temp container off-screen agar zoom scaler tidak mempengaruhi
        const invoice = document.querySelector('.invoice-page') as HTMLElement;
        const agreement = document.querySelector('.agreement-page') as HTMLElement;
        const temp = document.createElement('div');
        temp.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;';
        temp.appendChild(invoice.cloneNode(true));
        const spacer = document.createElement('div');
        spacer.className = 'page-break';
        temp.appendChild(spacer);
        temp.appendChild(agreement.cloneNode(true));
        document.body.appendChild(temp);
        try {
          await html2pdf().set(opts).from(temp).save();
        } finally {
          document.body.removeChild(temp);
        }
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return { downloadPdf, isGenerating };
}
