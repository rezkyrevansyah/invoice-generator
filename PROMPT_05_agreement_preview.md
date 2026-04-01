Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama.

Semua file dari PROMPT_01–04 sudah ada.

---

Buat 2 file: `components/preview/AgreementPage.tsx` dan `components/preview/DocumentPreview.tsx`.

---

### `components/preview/AgreementPage.tsx`

Props:
```tsx
interface AgreementPageProps {
  data: InvoiceFormData
  freelancer: FreelancerData
}
```

Aturan wajib sama seperti InvoicePage:
- Font size konten maksimal 12px
- Warna kritis pakai `style={{ ... }}`, BUKAN Tailwind dynamic class
- JANGAN taruh `className="page-break"` di sini (page-break sudah ada di InvoicePage)

**Konten (urutan dari atas):**

**HEADER**
Judul: "WORK AGREEMENT"
Subjudul: "PERJANJIAN KERJA FREELANCE"
Nomor: "No. Agreement: [Lihat Halaman 1]"
Paragraf pembuka (teks statis):
> Pada tanggal yang tercantum di halaman 1, telah dibuat dan disepakati Perjanjian Kerja Freelance antara **Pihak Pertama (Client)** dan **Pihak Kedua (Freelancer)** sebagaimana tercantum di halaman 1, dengan itikad baik, saling percaya, dan penuh tanggung jawab, dengan syarat dan ketentuan sebagai berikut:

**INFO BOX** — border kiri 3px `#0F6E56`, padding kiri, background putih atau sangat light
Teks statis:
> 📄 **INFORMASI LENGKAP PROJECT & PIHAK-PIHAK**
> Semua detail project (nama, scope, deliverables, durasi, nilai kontrak, dll) **tercantum di HALAMAN 1**. Informasi Pihak Pertama (Client) dan Pihak Kedua (Freelancer) juga **tercantum di HALAMAN 1**.
> *Syarat dan ketentuan di bawah ini mengacu pada informasi tersebut.*

**SYARAT DAN KETENTUAN**

Render semua pasal berikut secara lengkap. JANGAN diringkas. JANGAN pakai "..." atau "[dst]". Ini dokumen hukum.

---

**PASAL 1: RUANG LINGKUP PEKERJAAN**

- Pihak Kedua (Freelancer) berkomitmen untuk menyelesaikan pekerjaan sesuai yang tercantum di halaman 1 (Project Details) dengan kualitas profesional dan sesuai standar industri.
- Pihak Pertama (Client) berhak mendapatkan revisi sesuai jumlah yang tercantum di halaman 1 tanpa biaya tambahan.

**PASAL 2: JANGKA WAKTU PEKERJAAN**

- Tanggal mulai dan selesai pekerjaan mengikuti yang tercantum di halaman 1.
- Timeline akan dikelola secara terstruktur dengan progress update sesuai frekuensi yang disepakati di halaman 1.

**PASAL 3: NILAI KONTRAK DAN SKEMA PEMBAYARAN**

- Nilai kontrak mengikuti PROJECT VALUE yang tercantum di halaman 1.
- Skema pembayaran mengikuti Payment Option yang dipilih di halaman 1 (Option A atau Option B).
- Semua terms & conditions dari masing-masing Payment Option yang tercantum di halaman 1 berlaku mengikat.

**PASAL 4: HAK DAN KEWAJIBAN PIHAK KEDUA (FREELANCER)**

- Pihak Kedua WAJIB menyelesaikan pekerjaan sesuai dengan ruang lingkup dan jangka waktu yang tercantum di halaman 1. Komitmen ini bersifat mengikat secara hukum.
- Pihak Kedua wajib memberikan update progress kepada Pihak Pertama sesuai frekuensi yang tercantum di halaman 1.
- Pihak Kedua wajib menjaga kerahasiaan informasi dan data yang diberikan oleh Pihak Pertama (NDA berlaku).
- Pihak Kedua wajib merespons komunikasi dari Pihak Pertama maksimal dalam 24 jam.
- Pihak Kedua berhak menerima pembayaran sesuai skema yang dipilih sebagai bentuk komitmen profesional.

**PASAL 5: HAK DAN KEWAJIBAN PIHAK PERTAMA (CLIENT)**

- Pihak Pertama wajib memberikan brief, referensi, dan guidelines yang jelas maksimal 1 hari setelah pembayaran awal.
- Pihak Pertama wajib memberikan feedback dan approval dalam waktu wajar (maksimal 2 hari per revisi).
- Pihak Pertama WAJIB melakukan pembayaran sesuai skema yang dipilih (Option A atau Option B) di halaman 1.
- Pihak Pertama berhak meminta revisi sesuai jumlah yang tercantum di halaman 1 tanpa biaya tambahan.
- Pihak Pertama berhak mendapatkan proteksi hukum penuh sesuai Pasal 6 jika Pihak Kedua melakukan wanprestasi.

**PASAL 6: SANKSI, WANPRESTASI & PERLINDUNGAN HUKUM**

⚖️ JAMINAN PERLINDUNGAN HUKUM UNTUK KEDUA BELAH PIHAK ⚖️

**WANPRESTASI DARI PIHAK KEDUA (FREELANCER):**
Apabila Pihak Kedua tidak menyelesaikan pekerjaan sesuai deadline yang tercantum di halaman 1 tanpa alasan yang dapat dipertanggungjawabkan, atau tidak memberikan kabar/update lebih dari 3 hari berturut-turut, atau menghilang setelah menerima pembayaran, maka Pihak Kedua dinyatakan melakukan WANPRESTASI.

**KONSEKUENSI HUKUM:**
- Option A: Pihak Pertama berhak menuntut pengembalian dana 100% + ganti rugi (KUHPerdata Pasal 1243)
- Option B: Jika wanprestasi sebelum 70% → refund DP 100%. Jika setelah 70% → refund total dana + ganti rugi
- Tindakan Hukum: Dokumen ini memiliki kekuatan hukum yang sah, dapat dilaporkan ke polisi (Pasal 378 KUHP) dan pengadilan

**WANPRESTASI DARI PIHAK PERTAMA (CLIENT):**
- Tidak bayar awal: Perjanjian batal, Pihak Kedua tidak wajib mulai pekerjaan
- Tidak bayar pelunasan (Option B): Pihak Kedua stop pekerjaan, DP jadi kompensasi untuk 70% yang selesai
- Pembatalan sepihak (Option B): DP non-refundable sebagai kompensasi waktu dan tenaga

**PASAL 7: INTELLECTUAL PROPERTY RIGHTS**

- Seluruh hak cipta atas hasil pekerjaan menjadi milik Pihak Pertama setelah pembayaran 100% lunas dan final approval diberikan.
- Untuk Option B, final deliverables diserahkan setelah pelunasan 50% diterima. Sebelum pelunasan, client hanya dapat preview tanpa source files.
- Pihak Kedua diperbolehkan menggunakan hasil untuk portofolio dengan mencantumkan nama Pihak Pertama, kecuali ada NDA khusus.

**PASAL 8: FORCE MAJEURE**

- Apabila terjadi keadaan memaksa (force majeure) yang menghalangi penyelesaian pekerjaan, kedua belah pihak sepakat untuk bernegosiasi kembali terkait timeline secara profesional.
- Dalam kondisi force majeure, pembayaran yang telah dilakukan akan ditinjau berdasarkan progress pekerjaan yang telah diselesaikan.

**PASAL 9: PENYELESAIAN PERSELISIHAN**

- Segala perselisihan akan diselesaikan secara musyawarah untuk mufakat dengan komunikasi yang baik.
- Apabila musyawarah tidak tercapai, kedua belah pihak sepakat untuk menyelesaikan melalui jalur hukum yang berlaku di Indonesia.

---

Paragraf penutup (teks statis):
> Demikian perjanjian ini dibuat dengan sebenar-benarnya dalam keadaan sehat jasmani dan rohani, tanpa paksaan dari pihak manapun, dengan penuh kesadaran dan tanggung jawab profesional, untuk dipergunakan sebagaimana mestinya dan memiliki kekuatan hukum yang mengikat.

**TANDA TANGAN** — tabel 2 kolom

Kolom kiri — PIHAK PERTAMA (CLIENT):
- Label: "PIHAK PERTAMA (CLIENT)"
- Nama: `{data.clientPIC}`
- Jabatan: `PIC {data.clientCompany}`
- Checkbox:
  - `{data.paymentOption === 'A' ? '☑' : '☐'} Option A`
  - `{data.paymentOption === 'B' ? '☑' : '☐'} Option B`

Kolom kanan — PIHAK KEDUA (FREELANCER):
- Label: "PIHAK KEDUA (FREELANCER)"
- Nama: `{freelancer.name}`
- Jabatan: `{freelancer.title}`

Area tanda tangan: ruang kosong untuk tanda tangan (height ~60px tiap kolom).

**FOOTER** — teks statis, center, italic, font kecil (10px):
> ✦ Dokumen ini sah dan memiliki kekuatan hukum mengikat tanpa tanda tangan basah karena dibuat secara digital ✦
> Kedua belah pihak telah membaca, memahami, dan menyetujui seluruh isi perjanjian ini
> Mohon centang payment option yang dipilih di area tanda tangan

---

### `components/preview/DocumentPreview.tsx`

Props:
```tsx
interface DocumentPreviewProps {
  data: InvoiceFormData
  freelancer: FreelancerData
}
```

Render:
```tsx
<div className="preview-panel">
  <InvoicePage data={data} freelancer={freelancer} />
  <AgreementPage data={data} freelancer={freelancer} />
</div>
```

Styling wrapper: tidak perlu background atau border — `preview-panel` class sudah dihandle print.css.

Tampilkan kedua file lengkap.
