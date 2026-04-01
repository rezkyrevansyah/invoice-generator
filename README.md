# Prompts — Invoice Generator

Folder ini berisi 7 prompt untuk membangun Invoice & Work Agreement Generator secara bertahap menggunakan Claude.

## Cara Pakai

### Di Claude Code (terminal)
```bash
claude < prompts/PROMPT_01_scaffolding.md
```

### Di Claude.ai (chat)
Copy-paste isi file ke chat. Selalu attach atau paste `PROJECT_CONTEXT.md` di awal sesi baru.

---

## Urutan Eksekusi

| File | Isi | Output yang Dihasilkan |
|---|---|---|
| `PROMPT_01_scaffolding.md` | Setup awal | `lib/types.ts`, `lib/defaults.ts`, `lib/utils.ts`, `hooks/useLocalStorage.ts` |
| `PROMPT_02_layout_stepper.md` | Layout & navigasi | `styles/print.css`, `app/layout.tsx`, `app/page.tsx`, `app/generator/page.tsx`, `components/Stepper.tsx` |
| `PROMPT_03_form_components.md` | Form 4 langkah | `components/form/Step*.tsx` (4 file) + update `page.tsx` + update `utils.ts` |
| `PROMPT_04_invoice_preview.md` | Halaman 1 dokumen | `components/preview/InvoicePage.tsx` |
| `PROMPT_05_agreement_preview.md` | Halaman 2 + wrapper | `components/preview/AgreementPage.tsx`, `components/preview/DocumentPreview.tsx` |
| `PROMPT_06_integration.md` | Integrasi final | `components/PrintButton.tsx` + update `app/generator/page.tsx` |
| `PROMPT_07_deploy.md` | Deploy Vercel | `tailwind.config.ts`, `next.config.ts`, instruksi deploy |

---

## Aturan Penting

- **Jalankan berurutan.** Tiap prompt depend pada output prompt sebelumnya.
- **Jangan skip.** Jika skip, akan ada missing file saat integrasi.
- **Satu prompt = satu sesi Claude baru** (kecuali ada error yang perlu difix di sesi yang sama).
- **Simpan semua file** yang dihasilkan sebelum lanjut ke prompt berikutnya.
- **Jika Claude salah** (misalnya bikin Pages Router), lihat `PROJECT_CONTEXT.md` section 14 untuk prompt koreksi.

---

## Cek Hasil Tiap Prompt

Sebelum lanjut ke prompt berikutnya, pastikan:
- Tidak ada TypeScript error (`npx tsc --noEmit`)
- File ada di path yang benar sesuai `PROJECT_CONTEXT.md` section 3
- Tidak ada `console.error` saat `npm run dev`
