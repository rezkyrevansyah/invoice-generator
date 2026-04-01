# PROJECT_CONTEXT.md
# Invoice & Work Agreement Generator

> File ini adalah referensi konteks project untuk AI assistant.
> Letakkan di root folder project. Jangan dihapus.

---

## 1. Overview

### Tujuan
Web app personal untuk freelancer (M. Rezky Revansyah Suprihono) agar dapat membuat Invoice + Work Agreement PDF secara cepat, konsisten, dan profesional — menggantikan proses edit manual file `.docx` per project.

### User
Single user — pemilik sendiri. Tidak perlu auth/login.

### Scope V1
- Form wizard 4 langkah: Info Dokumen → Info Client → Detail Project → Pembayaran
- Auto-generate nomor invoice & agreement (format `INV/YYYY/MM/XXX`)
- Preview dokumen realtime (split view desktop)
- Export via `window.print()` → Save as PDF (A4, print-optimized)
- Data freelancer disimpan ke `localStorage` (isi sekali, persisten)

### Out of Scope V1
Database, auth, multi-user, history invoice, email send, signature digital.

---

## 2. Tech Stack

| Concern | Keputusan |
|---|---|
| Framework | Next.js terbaru — **App Router** (BUKAN Pages Router) |
| Styling | Tailwind CSS v3 — utility-first, no CSS modules |
| State | React `useState` + `useReducer` — no external lib |
| Storage | `localStorage` via custom hook |
| PDF Export | `window.print()` + `@media print` CSS — zero dependency |
| Type Safety | TypeScript — semua props & state harus typed |
| Deploy | Vercel — push GitHub → auto deploy |
| Package Manager | npm |

---

## 3. Struktur Folder

```
invoice-generator/
├── app/
│   ├── layout.tsx              ← root layout, import print.css di sini
│   ├── page.tsx                ← redirect ke /generator
│   └── generator/
│       └── page.tsx            ← halaman utama: state, form, preview
├── components/
│   ├── form/
│   │   ├── StepInfo.tsx        ← Step 1: nomor invoice, tanggal
│   │   ├── StepClient.tsx      ← Step 2: nama company & PIC client
│   │   ├── StepProject.tsx     ← Step 3: detail project & nilai kontrak
│   │   └── StepPayment.tsx     ← Step 4: pilih payment option
│   ├── preview/
│   │   ├── DocumentPreview.tsx ← wrapper: render InvoicePage + AgreementPage
│   │   ├── InvoicePage.tsx     ← halaman 1 dokumen (invoice)
│   │   └── AgreementPage.tsx   ← halaman 2 dokumen (work agreement)
│   ├── Stepper.tsx             ← progress indicator step 1–4
│   └── PrintButton.tsx         ← tombol print + modal instruksi
├── lib/
│   ├── types.ts                ← TypeScript interfaces (source of truth)
│   ├── defaults.ts             ← nilai default form & data freelancer
│   └── utils.ts                ← helper: format Rupiah, tanggal, nomor invoice
├── hooks/
│   └── useLocalStorage.ts      ← custom hook generic untuk localStorage
└── styles/
    └── print.css               ← CSS khusus @media print
```

---

## 4. TypeScript Interfaces

> Ini adalah **source of truth** untuk semua data. Jangan ubah nama field tanpa update semua komponen.

```typescript
// lib/types.ts

export interface FreelancerData {
  name: string;           // 'M. Rezky Revansyah Suprihono'
  title: string;          // 'Software Engineer, UI/UX Designer & Full-Stack Developer'
  experience: string;     // '3+ Years'
  bank: string;           // 'BCA'
  accountNumber: string;  // '0661642679'
  accountName: string;    // 'M. Rezky Revansyah Suprihono'
}

export interface InvoiceFormData {
  // Step 1 — Info Dokumen
  invoiceNumber: string;       // auto-generated, bisa di-override user
  agreementNumber: string;     // auto-generated, bisa di-override user
  invoiceDate: string;         // ISO date string (YYYY-MM-DD)
  agreementDate: string;       // default = sama dengan invoiceDate
  initialPaymentDue: string;   // default = invoiceDate + 1 hari
  projectDeadline: string;

  // Step 2 — Info Client
  clientCompany: string;
  clientPIC: string;

  // Step 3 — Detail Project
  projectName: string;
  scopeOfWork: string;
  deliverables: string;
  revisionRounds: number;
  projectDuration: number;    // dalam hari kerja
  startDate: string;          // default = invoiceDate
  endDate: string;            // default = projectDeadline
  progressUpdate: string;     // default: 'Setiap 2 hari atau sesuai milestone'
  projectValue: number;       // dalam Rupiah (integer)

  // Step 4 — Pembayaran
  paymentOption: 'A' | 'B' | null;
}
```

---

## 5. lib/utils.ts — Fungsi Wajib

```typescript
// Format: INV/2026/04/001 — auto increment dari localStorage counter
generateInvoiceNumber(date: Date): string

// Format: WA/2026/04/001
generateAgreementNumber(date: Date): string

// Format: 'Rp 1.200.000,-'
formatRupiah(amount: number): string

// Format: 'Satu Juta Dua Ratus Ribu Rupiah'
// Test cases: 1200000→'Satu Juta Dua Ratus Ribu Rupiah', 500000→'Lima Ratus Ribu Rupiah'
// Gunakan array satuan & puluhan, BUKAN hardcode
formatRupiahWords(amount: number): string

// Format: '13 Februari 2026'
formatDateID(dateString: string): string

// Format: 'Kamis, 13 Februari 2026'
formatDateLong(dateString: string): string
```

---

## 6. State Management

Semua state ada di `app/generator/page.tsx` (parent). Komponen form dan preview menerima data via props.

```
page.tsx
├── currentStep: number (1–4)
├── formData: InvoiceFormData        ← source of truth
├── freelancerData: FreelancerData   ← dari localStorage
│
├── <Stepper currentStep={currentStep} />
├── <StepXxx data={formData} onChange={(field, value) => setFormData(...)} />
└── <DocumentPreview data={formData} freelancer={freelancerData} />
```

**Aturan:**
- `formData` state hanya ada di `page.tsx`, bukan di masing-masing step component
- Preview re-render otomatis setiap `formData` berubah (no debounce di v1)
- `onChange` signature: `(field: keyof InvoiceFormData, value: any) => void`

---

## 7. UX Flow

### Layout Desktop (≥1024px)
Split view 2 kolom:
- **Kiri (45%):** Stepper + form panel aktif + tombol Kembali/Lanjut
- **Kanan (55%):** Preview dokumen (sticky, scrollable), PrintButton di atas

### Layout Mobile (<1024px)
Single column. Preview collapsed by default, ada tombol "Lihat Preview".

### Step Navigation
| Step | Label | Field Wajib (validasi) |
|---|---|---|
| 1 | Info Dokumen | `invoiceDate`, `projectDeadline` |
| 2 | Info Client | `clientCompany`, `clientPIC` |
| 3 | Detail Project | `projectName`, `projectValue` |
| 4 | Pembayaran | `paymentOption` |

Tombol "Lanjut" di step 4 diganti "Lihat Preview Penuh / Print".

---

## 8. Komponen Form — Spec Ringkas

### StepInfo.tsx
- `invoiceNumber`: readonly + edit icon untuk override; auto-generate saat mount
- `agreementNumber`: readonly + edit icon; auto-generate saat mount
- `invoiceDate`, `agreementDate`, `initialPaymentDue`, `projectDeadline`: date picker

### StepClient.tsx
- `clientCompany`: text, placeholder `PT Nama Perusahaan`
- `clientPIC`: text, placeholder `Nama PIC / Contact Person`

### StepProject.tsx
- `projectName`: text
- `scopeOfWork`, `deliverables`: textarea rows=3
- `revisionRounds`: number, min=1, max=99
- `projectDuration`: number, min=1, satuan "hari kerja"
- `startDate`, `endDate`: date
- `progressUpdate`: text, default `Setiap 2 hari atau sesuai milestone`
- `projectValue`: number input; tampilkan preview format Rupiah di bawah input

### StepPayment.tsx
- 2 card besar: Option A (Full 100%) vs Option B (DP 50%+50%)
- Klik card = select; hanya satu yang aktif
- Info rekening freelancer ditampilkan read-only
- Link kecil "Edit info rekening" → modal edit `FreelancerData` → simpan ke localStorage

---

## 9. Komponen Preview — Spec Ringkas

### InvoicePage.tsx
Props: `{ data: InvoiceFormData, freelancer: FreelancerData }`

Konten (urutan dari atas):
1. **Header** — judul "INVOICE & WORK AGREEMENT", subtitle italic, garis bawah `#0F6E56`
2. **Section 1** — tabel info dokumen (invoice number, dates, deadline)
3. **Section 2** — tabel FROM (freelancer) | TO (client + PIC)
4. **Section 3** — tabel detail project (semua field + PROJECT VALUE bold)
5. **Payment Options** — Option A & B dengan bullet points. Highlight opsi yang dipilih. Jika `paymentOption === null`, tampilkan keduanya tanpa highlight.
6. **Info box kuning** — "Mengapa Sistem Ini Aman untuk Client?" (4 poin, teks statis)
7. **Section 4** — info rekening transfer (dari `freelancerData`)
8. **Footer** — "Thank you for your trust and business!"

Wrapper terluar harus punya `className="page-break"`.

### AgreementPage.tsx
Props: `{ data: InvoiceFormData, freelancer: FreelancerData }`

Konten (urutan dari atas):
1. **Header** — judul "WORK AGREEMENT / PERJANJIAN KERJA FREELANCE", no. agreement
2. **Paragraf pembuka** perjanjian (teks statis)
3. **Info box** — referensi ke halaman 1 (border kiri aksen, teks statis)
4. **Pasal 1–9** — teks STATIS lengkap, tidak disingkat
5. **Tanda tangan** — tabel 2 kolom: Pihak Pertama (client) | Pihak Kedua (freelancer). Checkbox ☑/☐ Option A dan B sesuai `paymentOption`
6. **Footer** — teks legalitas digital (statis)

> Teks pasal 1–9 adalah statis. Variabel dinamis HANYA ada di header (nomor agreement) dan tabel tanda tangan (nama pihak + checkbox).

### DocumentPreview.tsx
Wrapper yang merender `<InvoicePage />` + `<AgreementPage />` secara vertikal. Harus punya `className="preview-panel"`.

---

## 10. Print CSS — Aturan Wajib

File: `styles/print.css` — **WAJIB diimport di `app/layout.tsx`**, bukan di `page.tsx`.

```css
@media print {
  @page {
    size: A4;
    margin: 15mm 18mm;
  }

  /* Sembunyikan semua UI saat print */
  .no-print,
  .stepper,
  .form-panel,
  .print-btn,
  .preview-controls {
    display: none !important;
  }

  /* Preview jadi full width */
  .preview-panel {
    width: 100% !important;
    padding: 0 !important;
  }

  /* Page break antara halaman 1 dan 2 */
  .page-break {
    page-break-after: always;
    break-after: page;
  }

  /* Warna background harus ikut tercetak */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Jangan potong tabel di tengah halaman */
  table, tr, td {
    page-break-inside: avoid;
  }
}
```

**Aturan tambahan untuk komponen preview:**
- Font size konten **maksimal 12px** agar muat di A4
- Gunakan `style={{ backgroundColor: '#...' }}` untuk warna kritis — JANGAN Tailwind dynamic class seperti `bg-[#0F6E56]` karena bisa di-purge di production
- Semua warna yang perlu tercetak harus pakai `-webkit-print-color-adjust: exact`

---

## 11. PrintButton.tsx — Spec

- Tombol "Download PDF / Print" dengan ikon printer
- `className="no-print"` pada seluruh komponen ini (tombol + modal)
- `onClick`: tampilkan modal instruksi dulu, baru `window.print()`
- Modal instruksi (teks statis):
  1. Pastikan browser dalam mode desktop
  2. Klik Print / Save as PDF di dialog browser
  3. Set Paper size: A4
  4. Set Margins: Minimum atau None
  5. Aktifkan "Print background graphics"
- Tombol konfirmasi di modal: "Mengerti, lanjut print" → `window.print()`

---

## 12. hooks/useLocalStorage.ts

Custom hook generic. **Wajib handle SSR Next.js:**

```typescript
// Guard wajib — tanpa ini akan error di Next.js
if (typeof window === 'undefined') return defaultValue;
```

Digunakan untuk:
- `FreelancerData` (key: `'freelancer-data'`)
- Invoice number counter (key: `'invoice-counter'`)

---

## 13. Desain Visual

| Token | Nilai |
|---|---|
| Warna aksen | `#0F6E56` (hijau tua) |
| Aksen light | `#E1F5EE` (bg tabel header) |
| Aksen text | `#085041` |
| Background | putih (`#FFFFFF`) |
| Font | Inter dari `next/font` atau sistem |
| Tone | Clean, minimal, profesional — bukan playful |
| Animasi | Tidak perlu di v1 |

---

## 14. Troubleshooting Umum

### Preview tidak update realtime
`formData` state harus ada di `page.tsx` (parent). Props `onChange` update state di parent. Jangan taruh state di masing-masing step component.

### Warna hilang saat print
Tambahkan `* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }` di `print.css`. Ganti semua Tailwind bg-color class dengan `style={{ backgroundColor: '#...' }}`.

### formatRupiahWords error
Gunakan pendekatan array satuan & puluhan, bukan hardcode. Test cases yang harus lulus:
- `1200000` → `'Satu Juta Dua Ratus Ribu Rupiah'`
- `500000` → `'Lima Ratus Ribu Rupiah'`
- `2500000` → `'Dua Juta Lima Ratus Ribu Rupiah'`
- `750000` → `'Tujuh Ratus Lima Puluh Ribu Rupiah'`

### Page break tidak bekerja
Pastikan `print.css` diimport di `layout.tsx`. Wrapper `InvoicePage` harus punya `className="page-break"`.

### TypeScript error setelah integrasi
Jangan ubah interface di `lib/types.ts`. Perbaiki error di komponen yang menggunakannya.

### localStorage error di Next.js
Gunakan guard `typeof window !== 'undefined'` sebelum akses localStorage.

### Class Tailwind hilang di production (Vercel)
Pastikan `tailwind.config.ts` content array include:
```js
'./app/**/*.{ts,tsx}',
'./components/**/*.{ts,tsx}'
```
Jika masih hilang, ganti dengan `style={{ ... }}`.

---

## 15. QA Checklist

### Form & Validasi
- [ ] Nomor invoice auto-generate format `INV/YYYY/MM/XXX`
- [ ] Counter nomor invoice increment (tidak repeat)
- [ ] Semua date picker berfungsi, format tampil bahasa Indonesia
- [ ] Input project value tampil preview format Rupiah
- [ ] Pilihan Option A / B bisa di-select dan switch
- [ ] Data freelancer tersimpan setelah edit & reload
- [ ] Validasi field kosong muncul saat klik "Lanjut"

### Preview
- [ ] Preview update realtime saat ketik di form
- [ ] Nama client, PIC, project tampil benar
- [ ] Nilai kontrak tampil format Rupiah DAN terbilang
- [ ] Opsi pembayaran yang dipilih di-highlight
- [ ] Checkbox tanda tangan reflect pilihan Option A/B
- [ ] Teks pasal Work Agreement lengkap (tidak terpotong)

### Print / PDF
- [ ] Form & UI tersembunyi saat print
- [ ] Page break bekerja: invoice hal.1, work agreement hal.2
- [ ] Warna background & teks tabel tercetak
- [ ] Tidak ada elemen terpotong di pinggir halaman
- [ ] PDF bisa dibuka di Adobe Reader / browser

### Deploy
- [ ] Build Vercel berhasil tanpa error
- [ ] URL production bisa diakses dari mobile & desktop
- [ ] Tidak ada console error di production
- [ ] localStorage berfungsi di production URL
