Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama sebelum mulai.

---

Buat Next.js 16 App Router project baru dengan Tailwind CSS v4 untuk Invoice & Work Agreement Generator tool (freelancer personal tool).

Setup yang dibutuhkan:
- Next.js 16 dengan App Router (BUKAN Pages Router)
- Tailwind CSS v4 (pakai `@import "tailwindcss"` di globals.css, BUKAN `@tailwind base/components/utilities`)
- TypeScript
- Struktur folder persis seperti di PROJECT_CONTEXT.md section 3

Buat file-file berikut dengan isi lengkap:

**`lib/types.ts`**
Gunakan interface `FreelancerData` dan `InvoiceFormData` persis seperti di PROJECT_CONTEXT.md section 4. Jangan ubah nama field apapun.

**`lib/defaults.ts`**
Nilai default untuk `InvoiceFormData` dan `FreelancerData`. Data freelancer:
- name: 'M. Rezky Revansyah Suprihono'
- title: 'Software Engineer, UI/UX Designer & Full-Stack Developer'
- experience: '3+ Years'
- bank: 'BCA'
- accountNumber: '0661642679'
- accountName: 'M. Rezky Revansyah Suprihono'

Default `InvoiceFormData`: semua string kosong, number = 0, paymentOption = null, progressUpdate = 'Setiap 2 hari atau sesuai milestone yang disepakati'.

**`lib/utils.ts`**
Implementasi semua fungsi dari PROJECT_CONTEXT.md section 5:
- `generateInvoiceNumber(date: Date): string` → format `INV/YYYY/MM/XXX`, counter disimpan di localStorage dengan key `invoice-counter-YYYY-MM`
- `generateAgreementNumber(date: Date): string` → format `WA/YYYY/MM/XXX`, key `agreement-counter-YYYY-MM`
- `formatRupiah(amount: number): string` → `'Rp 1.200.000,-'`
- `formatRupiahWords(amount: number): string` → `'Satu Juta Dua Ratus Ribu Rupiah'`. Gunakan array satuan & puluhan, BUKAN hardcode. Test cases yang harus lulus: 1200000→'Satu Juta Dua Ratus Ribu Rupiah', 500000→'Lima Ratus Ribu Rupiah', 2500000→'Dua Juta Lima Ratus Ribu Rupiah', 750000→'Tujuh Ratus Lima Puluh Ribu Rupiah'
- `formatDateID(dateString: string): string` → `'13 Februari 2026'`
- `formatDateLong(dateString: string): string` → `'Kamis, 13 Februari 2026'`

Semua fungsi yang akses localStorage harus guard dengan `typeof window !== 'undefined'`.

**`hooks/useLocalStorage.ts`**
Custom hook generic: `useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]`.
Wajib handle SSR Next.js — guard dengan `typeof window !== 'undefined'`.

Jangan buat UI, halaman, atau komponen apapun dulu. Hanya 4 file di atas.
Tampilkan semua file lengkap dengan kode yang bisa langsung dipakai.
