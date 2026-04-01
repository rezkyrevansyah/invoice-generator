Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama.

Semua file dari PROMPT_01 dan PROMPT_02 sudah ada.

---

Buat 4 komponen form dan update `app/generator/page.tsx`.

Semua komponen form menerima props:
```tsx
interface FormStepProps {
  data: InvoiceFormData
  onChange: (field: keyof InvoiceFormData, value: any) => void
}
```

**`components/form/StepInfo.tsx`** — Step 1: Info Dokumen
Fields (sesuai PROJECT_CONTEXT.md section 8):
- `invoiceNumber`: input text readonly. Tampilkan tombol edit (ikon pensil) di sebelah kanan untuk override. Auto-generate dari `generateInvoiceNumber(new Date())` saat komponen mount (gunakan useEffect, panggil `onChange` untuk set nilai awal).
- `agreementNumber`: sama seperti invoiceNumber tapi pakai `generateAgreementNumber`
- `invoiceDate`: date input
- `agreementDate`: date input, default = `invoiceDate`
- `initialPaymentDue`: date input, default = `invoiceDate + 1 hari` (hitung otomatis di useEffect saat invoiceDate berubah)
- `projectDeadline`: date input

**`components/form/StepClient.tsx`** — Step 2: Info Client
Fields:
- `clientCompany`: text, placeholder `PT Nama Perusahaan`, required
- `clientPIC`: text, placeholder `Nama PIC / Contact Person`, required

**`components/form/StepProject.tsx`** — Step 3: Detail Project
Fields:
- `projectName`: text, required
- `scopeOfWork`: textarea rows=3
- `deliverables`: textarea rows=3
- `revisionRounds`: number input, min=1, max=99, satuan label "kali revisi"
- `projectDuration`: number input, min=1, satuan label "hari kerja"
- `startDate`: date, default = `invoiceDate`
- `endDate`: date, default = `projectDeadline`
- `progressUpdate`: text
- `projectValue`: number input (simpan sebagai integer Rupiah). Di bawah input, tampilkan preview teks: `formatRupiah(value)` dan `formatRupiahWords(value)` — update realtime. Required.

**`components/form/StepPayment.tsx`** — Step 4: Pembayaran
Props tambahan: `{ freelancerData: FreelancerData, onUpdateFreelancer: (data: FreelancerData) => void }`

- 2 card besar yang bisa diklik:
  - **Option A**: "Full Payment 100%". Deskripsi singkat: pembayaran 100% di awal sebelum pekerjaan dimulai.
  - **Option B**: "Down Payment 50% + Pelunasan 50%". Deskripsi singkat: DP 50% di awal, pelunasan 50% saat progress 70%.
  - Card yang dipilih: border `#0F6E56` lebih tebal, background `#E1F5EE`
  - Klik card → `onChange('paymentOption', 'A')` atau `'B'`
- Di bawah cards: tampilkan info rekening read-only (dari `freelancerData`)
- Link kecil "Edit info rekening" → buka modal sederhana dengan form edit `FreelancerData`. Simpan via `onUpdateFreelancer`. Modal harus punya `className="no-print"`.

**Validasi:**
Buat fungsi `validateStep(step: number, data: InvoiceFormData): string[]` di `lib/utils.ts` yang return array pesan error.
- Step 1: `invoiceDate` dan `projectDeadline` tidak boleh kosong
- Step 2: `clientCompany` dan `clientPIC` tidak boleh kosong
- Step 3: `projectName` tidak boleh kosong, `projectValue` harus > 0
- Step 4: `paymentOption` tidak boleh null

**Update `app/generator/page.tsx`:**
- Render komponen step yang sesuai `currentStep`
- Tambahkan state `errors: string[]`
- Saat klik "Lanjut": jalankan `validateStep`, jika ada error tampilkan di bawah form (merah), jangan pindah step
- Pass `freelancerData` dan `onUpdateFreelancer` ke `StepPayment`

Styling semua komponen: Tailwind CSS, label di atas input, gap konsisten 16px, desain bersih.

Tampilkan semua 4 file komponen + file utils.ts yang diupdate + page.tsx yang diupdate.
