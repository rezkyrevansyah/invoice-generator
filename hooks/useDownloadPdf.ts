'use client';
import { useState } from 'react';
import type { PrintTarget } from '@/app/generator/page';

const PDF_OPTS = {
  margin: [8, 0, 8, 0], // top/bottom 8mm margin, left/right 0 (element has its own padding)
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 3,           // higher scale = crisper text
    useCORS: true,
    logging: false,
    width: 794,
    windowWidth: 794,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
  },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  pagebreak: { mode: ['css', 'legacy'] },
};

/**
 * Clone an element completely outside the .preview-scaler so html2canvas
 * captures it at 1:1 zoom, not at the panel's responsive zoom value.
 */
function cloneOutside(el: HTMLElement): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText =
    'position:fixed;left:-9999px;top:0;width:794px;zoom:1;background:#fff;overflow:visible;';
  wrapper.appendChild(el.cloneNode(true));
  document.body.appendChild(wrapper);
  return wrapper;
}

export function useDownloadPdf() {
  const [isGenerating, setIsGenerating] = useState(false);

  async function downloadPdf(target: PrintTarget | 'settlement' | 'reimbursement', filename = 'document.pdf') {
    setIsGenerating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js') as any).default;
      const opts = { ...PDF_OPTS, filename };

      if (target === 'invoice') {
        const el = document.querySelector('.invoice-page') as HTMLElement;
        const wrapper = cloneOutside(el);
        try { await html2pdf().set(opts).from(wrapper.firstChild).save(); }
        finally { document.body.removeChild(wrapper); }

      } else if (target === 'agreement') {
        const el = document.querySelector('.agreement-page') as HTMLElement;
        const wrapper = cloneOutside(el);
        try { await html2pdf().set(opts).from(wrapper.firstChild).save(); }
        finally { document.body.removeChild(wrapper); }

      } else if (target === 'settlement') {
        const el = document.querySelector('.settlement-invoice-page') as HTMLElement;
        const wrapper = cloneOutside(el);
        try { await html2pdf().set(opts).from(wrapper.firstChild).save(); }
        finally { document.body.removeChild(wrapper); }

      } else if (target === 'reimbursement') {
        const el = document.querySelector('.reimbursement-page') as HTMLElement;
        const wrapper = cloneOutside(el);
        try { await html2pdf().set(opts).from(wrapper.firstChild).save(); }
        finally { document.body.removeChild(wrapper); }

      } else {
        // 'both' — invoice + agreement in one PDF
        const invoice = document.querySelector('.invoice-page') as HTMLElement;
        const agreement = document.querySelector('.agreement-page') as HTMLElement;
        const wrapper = document.createElement('div');
        wrapper.style.cssText =
          'position:fixed;left:-9999px;top:0;width:794px;zoom:1;background:#fff;overflow:visible;';
        wrapper.appendChild(invoice.cloneNode(true));
        const spacer = document.createElement('div');
        spacer.className = 'page-break';
        spacer.style.cssText = 'page-break-after:always;break-after:page;height:0;';
        wrapper.appendChild(spacer);
        wrapper.appendChild(agreement.cloneNode(true));
        document.body.appendChild(wrapper);
        try { await html2pdf().set(opts).from(wrapper).save(); }
        finally { document.body.removeChild(wrapper); }
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return { downloadPdf, isGenerating };
}
