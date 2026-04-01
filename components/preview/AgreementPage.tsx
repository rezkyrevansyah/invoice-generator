import type { FreelancerData, InvoiceFormData } from '@/lib/types';

interface AgreementPageProps {
  data: InvoiceFormData;
  freelancer: FreelancerData;
}

const CELL_LABEL: React.CSSProperties = {
  backgroundColor: '#E1F5EE',
  color: '#085041',
  fontWeight: 600,
  padding: '5px 10px',
  fontSize: '11px',
  border: '1px solid #c5e8da',
  verticalAlign: 'top',
};

const CELL_VALUE: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: '11px',
  border: '1px solid #e5e7eb',
  verticalAlign: 'top',
};

const PASAL_TITLE: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 11,
  color: '#085041',
  margin: '10px 0 4px',
};

const PASAL_BODY: React.CSSProperties = {
  margin: '0 0 0 14px',
  padding: 0,
  fontSize: 10,
  color: '#333',
  lineHeight: 1.7,
};

export default function AgreementPage({ data, freelancer }: AgreementPageProps) {
  return (
    <div className="agreement-page" style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a', backgroundColor: '#fff', padding: '48px 60px', width: '794px', boxSizing: 'border-box' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ height: 3, backgroundColor: '#0F6E56', borderRadius: 2, marginBottom: 10 }} />
        <h1 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.03em', textAlign: 'center' }}>
          WORK AGREEMENT
        </h1>
        <h2 style={{ fontSize: 12, fontWeight: 600, margin: '0 0 4px', textAlign: 'center', color: '#333' }}>
          PERJANJIAN KERJA FREELANCE
        </h2>
        <p style={{ fontSize: 10, textAlign: 'center', color: '#666', margin: '0 0 10px' }}>
          No. Agreement: [Lihat Halaman 1]
        </p>

        {/* Paragraf pembuka */}
        <p style={{ fontSize: 10, lineHeight: 1.7, color: '#333', margin: 0 }}>
          Pada tanggal yang tercantum di halaman 1, telah dibuat dan disepakati Perjanjian Kerja Freelance antara{' '}
          <strong>Pihak Pertama (Client)</strong> dan <strong>Pihak Kedua (Freelancer)</strong> sebagaimana tercantum
          di halaman 1, dengan itikad baik, saling percaya, dan penuh tanggung jawab, dengan syarat dan ketentuan
          sebagai berikut:
        </p>
      </div>

      {/* ── INFO BOX ────────────────────────────────────────────────────────── */}
      <div style={{ borderLeft: '3px solid #0F6E56', paddingLeft: 10, marginBottom: 12, backgroundColor: '#f9fefe', padding: '8px 10px 8px 12px', borderRadius: '0 6px 6px 0' }}>
        <p style={{ fontSize: 10, lineHeight: 1.7, margin: 0, color: '#333' }}>
          📄 <strong>INFORMASI LENGKAP PROJECT &amp; PIHAK-PIHAK</strong><br />
          Semua detail project (nama, scope, deliverables, durasi, nilai kontrak, dll) <strong>tercantum di HALAMAN 1</strong>.
          Informasi Pihak Pertama (Client) dan Pihak Kedua (Freelancer) juga <strong>tercantum di HALAMAN 1</strong>.<br />
          <em>Syarat dan ketentuan di bawah ini mengacu pada informasi tersebut.</em>
        </p>
      </div>

      {/* ── SYARAT DAN KETENTUAN ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#0F6E56', borderBottom: '1px solid #0F6E56', paddingBottom: 3, marginBottom: 6 }}>
          SYARAT DAN KETENTUAN
        </div>

        {/* Pasal 1 */}
        <p style={PASAL_TITLE}>PASAL 1: RUANG LINGKUP PEKERJAAN</p>
        <ul style={PASAL_BODY}>
          <li>Pihak Kedua (Freelancer) berkomitmen untuk menyelesaikan pekerjaan sesuai yang tercantum di halaman 1 (Project Details) dengan kualitas profesional dan sesuai standar industri.</li>
          <li>Pihak Pertama (Client) berhak mendapatkan revisi sesuai jumlah yang tercantum di halaman 1 tanpa biaya tambahan.</li>
        </ul>

        {/* Pasal 2 */}
        <p style={PASAL_TITLE}>PASAL 2: JANGKA WAKTU PEKERJAAN</p>
        <ul style={PASAL_BODY}>
          <li>Tanggal mulai dan selesai pekerjaan mengikuti yang tercantum di halaman 1.</li>
          <li>Timeline akan dikelola secara terstruktur dengan progress update sesuai frekuensi yang disepakati di halaman 1.</li>
        </ul>

        {/* Pasal 3 */}
        <p style={PASAL_TITLE}>PASAL 3: NILAI KONTRAK DAN SKEMA PEMBAYARAN</p>
        <ul style={PASAL_BODY}>
          <li>Nilai kontrak mengikuti PROJECT VALUE yang tercantum di halaman 1.</li>
          <li>Skema pembayaran mengikuti Payment Option yang dipilih di halaman 1 (Option A atau Option B).</li>
          <li>Semua terms &amp; conditions dari masing-masing Payment Option yang tercantum di halaman 1 berlaku mengikat.</li>
        </ul>

        {/* Pasal 4 */}
        <p style={PASAL_TITLE}>PASAL 4: HAK DAN KEWAJIBAN PIHAK KEDUA (FREELANCER)</p>
        <ul style={PASAL_BODY}>
          <li>Pihak Kedua WAJIB menyelesaikan pekerjaan sesuai dengan ruang lingkup dan jangka waktu yang tercantum di halaman 1. Komitmen ini bersifat mengikat secara hukum.</li>
          <li>Pihak Kedua wajib memberikan update progress kepada Pihak Pertama sesuai frekuensi yang tercantum di halaman 1.</li>
          <li>Pihak Kedua wajib menjaga kerahasiaan informasi dan data yang diberikan oleh Pihak Pertama (NDA berlaku).</li>
          <li>Pihak Kedua wajib merespons komunikasi dari Pihak Pertama maksimal dalam 24 jam.</li>
          <li>Pihak Kedua berhak menerima pembayaran sesuai skema yang dipilih sebagai bentuk komitmen profesional.</li>
        </ul>

        {/* Pasal 5 */}
        <p style={PASAL_TITLE}>PASAL 5: HAK DAN KEWAJIBAN PIHAK PERTAMA (CLIENT)</p>
        <ul style={PASAL_BODY}>
          <li>Pihak Pertama wajib memberikan brief, referensi, dan guidelines yang jelas maksimal 1 hari setelah pembayaran awal.</li>
          <li>Pihak Pertama wajib memberikan feedback dan approval dalam waktu wajar (maksimal 2 hari per revisi).</li>
          <li>Pihak Pertama WAJIB melakukan pembayaran sesuai skema yang dipilih (Option A atau Option B) di halaman 1.</li>
          <li>Pihak Pertama berhak meminta revisi sesuai jumlah yang tercantum di halaman 1 tanpa biaya tambahan.</li>
          <li>Pihak Pertama berhak mendapatkan proteksi hukum penuh sesuai Pasal 6 jika Pihak Kedua melakukan wanprestasi.</li>
        </ul>

        {/* Pasal 6 */}
        <p style={PASAL_TITLE}>PASAL 6: SANKSI, WANPRESTASI &amp; PERLINDUNGAN HUKUM</p>
        <div style={{ fontSize: 10, color: '#333', lineHeight: 1.7 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600, textAlign: 'center' }}>⚖️ JAMINAN PERLINDUNGAN HUKUM UNTUK KEDUA BELAH PIHAK ⚖️</p>

          <p style={{ margin: '0 0 3px', fontWeight: 600 }}>WANPRESTASI DARI PIHAK KEDUA (FREELANCER):</p>
          <p style={{ margin: '0 0 6px' }}>
            Apabila Pihak Kedua tidak menyelesaikan pekerjaan sesuai deadline yang tercantum di halaman 1 tanpa alasan
            yang dapat dipertanggungjawabkan, atau tidak memberikan kabar/update lebih dari 3 hari berturut-turut, atau
            menghilang setelah menerima pembayaran, maka Pihak Kedua dinyatakan melakukan WANPRESTASI.
          </p>

          <p style={{ margin: '0 0 3px', fontWeight: 600 }}>KONSEKUENSI HUKUM:</p>
          <ul style={{ ...PASAL_BODY, marginBottom: 6 }}>
            <li>Option A: Pihak Pertama berhak menuntut pengembalian dana 100% + ganti rugi (KUHPerdata Pasal 1243)</li>
            <li>Option B: Jika wanprestasi sebelum 70% → refund DP 100%. Jika setelah 70% → refund total dana + ganti rugi</li>
            <li>Tindakan Hukum: Dokumen ini memiliki kekuatan hukum yang sah, dapat dilaporkan ke polisi (Pasal 378 KUHP) dan pengadilan</li>
          </ul>

          <p style={{ margin: '0 0 3px', fontWeight: 600 }}>WANPRESTASI DARI PIHAK PERTAMA (CLIENT):</p>
          <ul style={PASAL_BODY}>
            <li>Tidak bayar awal: Perjanjian batal, Pihak Kedua tidak wajib mulai pekerjaan</li>
            <li>Tidak bayar pelunasan (Option B): Pihak Kedua stop pekerjaan, DP jadi kompensasi untuk 70% yang selesai</li>
            <li>Pembatalan sepihak (Option B): DP non-refundable sebagai kompensasi waktu dan tenaga</li>
          </ul>
        </div>

        {/* Pasal 7 */}
        <p style={PASAL_TITLE}>PASAL 7: INTELLECTUAL PROPERTY RIGHTS</p>
        <ul style={PASAL_BODY}>
          <li>Seluruh hak cipta atas hasil pekerjaan menjadi milik Pihak Pertama setelah pembayaran 100% lunas dan final approval diberikan.</li>
          <li>Untuk Option B, final deliverables diserahkan setelah pelunasan 50% diterima. Sebelum pelunasan, client hanya dapat preview tanpa source files.</li>
          <li>Pihak Kedua diperbolehkan menggunakan hasil untuk portofolio dengan mencantumkan nama Pihak Pertama, kecuali ada NDA khusus.</li>
        </ul>

        {/* Pasal 8 */}
        <p style={PASAL_TITLE}>PASAL 8: FORCE MAJEURE</p>
        <ul style={PASAL_BODY}>
          <li>Apabila terjadi keadaan memaksa (force majeure) yang menghalangi penyelesaian pekerjaan, kedua belah pihak sepakat untuk bernegosiasi kembali terkait timeline secara profesional.</li>
          <li>Dalam kondisi force majeure, pembayaran yang telah dilakukan akan ditinjau berdasarkan progress pekerjaan yang telah diselesaikan.</li>
        </ul>

        {/* Pasal 9 */}
        <p style={PASAL_TITLE}>PASAL 9: PENYELESAIAN PERSELISIHAN</p>
        <ul style={PASAL_BODY}>
          <li>Segala perselisihan akan diselesaikan secara musyawarah untuk mufakat dengan komunikasi yang baik.</li>
          <li>Apabila musyawarah tidak tercapai, kedua belah pihak sepakat untuk menyelesaikan melalui jalur hukum yang berlaku di Indonesia.</li>
        </ul>
      </div>

      {/* ── PARAGRAF PENUTUP ────────────────────────────────────────────────── */}
      <p style={{ fontSize: 10, lineHeight: 1.7, color: '#333', marginBottom: 14, fontStyle: 'italic' }}>
        Demikian perjanjian ini dibuat dengan sebenar-benarnya dalam keadaan sehat jasmani dan rohani, tanpa paksaan
        dari pihak manapun, dengan penuh kesadaran dan tanggung jawab profesional, untuk dipergunakan sebagaimana
        mestinya dan memiliki kekuatan hukum yang mengikat.
      </p>

      {/* ── TANDA TANGAN ────────────────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 14 }}>
        <thead>
          <tr>
            <th style={{ ...CELL_LABEL, textAlign: 'center', width: '50%' }}>PIHAK PERTAMA (CLIENT)</th>
            <th style={{ ...CELL_LABEL, textAlign: 'center', width: '50%' }}>PIHAK KEDUA (FREELANCER)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...CELL_VALUE, textAlign: 'center', height: 60 }}>
              {/* ruang tanda tangan */}
            </td>
            <td style={{ ...CELL_VALUE, textAlign: 'center', height: 60 }}>
              {/* ruang tanda tangan */}
            </td>
          </tr>
          <tr>
            <td style={{ ...CELL_VALUE, textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{data.clientPIC || '_______________'}</div>
              <div style={{ color: '#555' }}>PIC {data.clientCompany || '_______________'}</div>
              {(data.paymentDisplay === 'both' || data.paymentDisplay === 'A' || data.paymentDisplay === 'B') && (
                <div style={{ marginTop: 6, fontSize: 10 }}>
                  {(data.paymentDisplay === 'both' || data.paymentDisplay === 'A') && (
                    <span style={{ marginRight: 8 }}>{data.paymentOption === 'A' ? '☑' : '☐'} Option A</span>
                  )}
                  {(data.paymentDisplay === 'both' || data.paymentDisplay === 'B') && (
                    <span>{data.paymentOption === 'B' ? '☑' : '☐'} Option B</span>
                  )}
                </div>
              )}
            </td>
            <td style={{ ...CELL_VALUE, textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{freelancer.name}</div>
              <div style={{ color: '#555', fontSize: 10 }}>{freelancer.title}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: 8, fontSize: 10, fontStyle: 'italic', color: '#666' }}>
        <div>✦ Dokumen ini sah dan memiliki kekuatan hukum mengikat tanpa tanda tangan basah karena dibuat secara digital ✦</div>
        <div>Kedua belah pihak telah membaca, memahami, dan menyetujui seluruh isi perjanjian ini</div>
        <div>Mohon centang payment option yang dipilih di area tanda tangan</div>
      </div>

    </div>
  );
}
