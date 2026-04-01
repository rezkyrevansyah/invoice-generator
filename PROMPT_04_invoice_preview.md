Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama.

Semua file dari PROMPT_01, 02, 03 sudah ada.

---

Buat `components/preview/InvoicePage.tsx`.

Props:
```tsx
interface InvoicePageProps {
  data: InvoiceFormData
  freelancer: FreelancerData
}
```

Render HTML yang mereplikasi layout invoice. Ini komponen yang akan di-print — perhatikan aturan print CSS di PROJECT_CONTEXT.md section 10.

**Aturan wajib untuk komponen ini:**
- Font size konten maksimal 12px agar muat di A4
- JANGAN gunakan Tailwind dynamic class seperti `bg-[#0F6E56]` — pakai `style={{ backgroundColor: '#0F6E56' }}` untuk semua warna kritis
- Wrapper terluar WAJIB punya `className="page-break"`
- Semua background color yang perlu tercetak harus pakai `style` bukan class

**Konten (urutan dari atas):**

**HEADER**
- Judul: "INVOICE & WORK AGREEMENT" — bold, besar
- Subtitle italic: "Flexible Payment Options Available"
- Tag kecil: "Flexible Payment Options Available"
- Garis bawah tebal warna `#0F6E56`

**SECTION 1 — Info Dokumen** (tabel 2 kolom: label kiri, value kanan)
| Label | Value |
|---|---|
| Invoice Number: | `{data.invoiceNumber}` |
| Agreement Number: | `{data.agreementNumber}` |
| Invoice Date: | `{formatDateID(data.invoiceDate)}` |
| Agreement Date: | `{formatDateLong(data.agreementDate)}` |
| Initial Payment Due: | `{formatDateID(data.initialPaymentDue)}` (1 hari kerja) |
| Project Deadline: | `{formatDateID(data.projectDeadline)}` |

Header kolom label: background `#E1F5EE`, teks `#085041`.

**SECTION 2 — Pihak** (tabel 2 kolom: FROM | TO)
- FROM: `{freelancer.name}` bold, `{freelancer.title}`, *Experience: {freelancer.experience}*
- TO: `{data.clientCompany}` bold, `Attn: {data.clientPIC} (PIC)`

**SECTION 3 — Detail Project** (tabel 2 kolom: label | value)
| Label | Value |
|---|---|
| Project Name: | `{data.projectName}` |
| Scope of Work: | `{data.scopeOfWork}` |
| Deliverables: | `{data.deliverables}` |
| Revision Rounds: | `{data.revisionRounds} (terbilang) kali revisi` |
| Project Duration: | `{data.projectDuration} (terbilang) hari kerja` |
| Start Date: | `{formatDateID(data.startDate)}` |
| End Date: | `{formatDateID(data.endDate)}` |
| Progress Updates: | `{data.progressUpdate}` |
| **PROJECT VALUE:** | **`{formatRupiah(data.projectValue)}`** (`{formatRupiahWords(data.projectValue)}`) |

Baris PROJECT VALUE: bold, font lebih besar (14px), background `#E1F5EE`.

**PAYMENT OPTIONS — 2 blok**

Kondisi highlight:
- `paymentOption === 'A'`: blok A punya border `#0F6E56` dan background `#E1F5EE`, blok B normal
- `paymentOption === 'B'`: blok B highlighted, blok A normal
- `paymentOption === null`: keduanya normal tanpa highlight

Isi Option A (teks statis, render sebagai bullet points):
```
☐ OPTION A: FULL PAYMENT 100% (RECOMMENDED)
• Total payment 100% sesuai nilai kontrak di atas dibayar di awal sebelum pekerjaan dimulai atau sebelum preview pertama diserahkan
• Pembayaran harus dilakukan maksimal sesuai Initial Payment Due yang tercantum di atas
• Pekerjaan dimulai segera setelah konfirmasi pembayaran diterima
• Priority response time dan faster turnaround untuk opsi ini
• 100% dilindungi Work Agreement - full refund guarantee jika project tidak selesai sesuai ketentuan
```
Jika `paymentOption === 'A'`, ganti ☐ dengan ☑.

Isi Option B (teks statis, render sebagai bullet points):
```
☐ OPTION B: DOWN PAYMENT 50% + PELUNASAN 50%
• DP (Down Payment): 50% dari nilai kontrak dibayar di awal sebelum pekerjaan dimulai
• Pelunasan: 50% sisanya dibayar saat progress mencapai 70% dari total scope of work
• DP harus dibayar maksimal sesuai Initial Payment Due yang tercantum di atas
• Pekerjaan dimulai setelah DP diterima
• Pelunasan dibayar saat progress mencapai 70% (akan dikonfirmasi via progress report)
• Final deliverables diserahkan setelah pelunasan 100% diterima
• DP bersifat non-refundable jika client membatalkan project di tengah jalan (setelah pekerjaan dimulai)
• DP wajib dikembalikan 100% jika freelancer tidak menyelesaikan hingga tahap 70%
```
Jika `paymentOption === 'B'`, ganti ☐ dengan ☑.

**INFO BOX KUNING** — background `#FFFBE6`, border kiri kuning
Judul: "💡 Mengapa Sistem Pembayaran Ini Aman untuk Client?"
4 poin (teks statis):
1. Work Agreement Mengikat Secara Hukum: Dokumen perjanjian ini dapat digunakan untuk proses hukum jika terjadi wanprestasi.
2. Track Record Terverifikasi: Pengalaman kerja dengan portfolio klien terpercaya yang dapat dicek.
3. Transparansi Penuh: Progress update rutin sesuai kesepakatan + akses preview secara berkala.
4. Standar Industri: Sistem DP atau upfront payment adalah praktik normal di freelance profesional untuk memastikan komitmen serius dari kedua belah pihak.

**SECTION 4 — Transfer ke Rekening** (tabel 2 kolom)
| | |
|---|---|
| Bank | : `{freelancer.bank}` |
| Nomor Rekening | : **`{freelancer.accountNumber}`** |
| Nama Pemilik | : `{freelancer.accountName}` |

**IMPORTANT NOTES** — bullet points teks statis:
- Please SELECT ONE PAYMENT OPTION above and inform us via chat/email
- Initial payment must be completed within the specified due date above
- Please send payment proof via chat/email with selected payment option
- Work commences immediately after initial payment confirmation
- This invoice is valid in conjunction with the Work Agreement on page 2
- Legal protection applies per Indonesian law - see Work Agreement for complete terms

**FOOTER**
- "Thank you for your trust and business!" — bold, center
- "Looking forward to delivering excellent results" — italic, center

Tampilkan file lengkap.
