Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama.

Semua file dari PROMPT_01 sudah ada (lib/types.ts, lib/defaults.ts, lib/utils.ts, hooks/useLocalStorage.ts).

---

Buat layout utama dan komponen Stepper. Hasilkan file-file berikut:

**`styles/print.css`**
Isi persis seperti di PROJECT_CONTEXT.md section 10. Tidak boleh ada perubahan atau tambahan apapun.

**`app/layout.tsx`**
- Import `styles/print.css` di sini (BUKAN di page.tsx)
- Setup font Inter dari `next/font/google`
- Metadata: title 'Invoice Generator', description 'Freelance Invoice & Work Agreement Generator'

**`app/page.tsx`**
Redirect ke `/generator`:
```tsx
import { redirect } from 'next/navigation'
export default function Home() { redirect('/generator') }
```

**`app/generator/page.tsx`**
State yang dikelola:
- `currentStep: number` (1–4)
- `formData: InvoiceFormData` (dari `defaultFormData`)
- `freelancerData: FreelancerData` (dari localStorage via `useLocalStorage`, key: `'freelancer-data'`, default: `defaultFreelancerData`)

Layout:
- Desktop (≥1024px): 2 kolom — kiri 45% (form panel), kanan 55% (preview panel, sticky top-0, overflow-y-auto, max-h-screen)
- Mobile (<1024px): single column

Struktur JSX:
```
<main>
  <div class="form-panel no-print">
    <Stepper currentStep={currentStep} />
    {/* Placeholder: <p>Form akan ada di sini — Step {currentStep}</p> */}
    {/* Tombol Kembali & Lanjut */}
  </div>
  <div class="preview-panel">
    {/* Placeholder: <p>Preview akan ada di sini</p> */}
  </div>
</main>
```

Tombol navigasi:
- "Kembali" (disabled di step 1) → `currentStep - 1`
- "Lanjut" (step 1–3) → `currentStep + 1`
- Step 4: ganti "Lanjut" dengan "Lihat Preview Penuh / Print"
- Kedua tombol punya `className="no-print"`

**`components/Stepper.tsx`**
Props: `{ currentStep: number }`
4 steps: 'Info Dokumen' | 'Info Client' | 'Detail Project' | 'Pembayaran'
- Step done (< currentStep): tampilkan checkmark ✓, warna aksen `#0F6E56`
- Step aktif (= currentStep): nomor bold, background `#0F6E56`, teks putih
- Step belum (> currentStep): nomor + border abu, teks muted
- Connector line antar step: garis horizontal, warna aksen jika done, abu jika belum

Desain: clean, minimal, profesional. Warna aksen `#0F6E56`. Tailwind CSS. Tidak perlu animasi.

Tampilkan semua file lengkap.
