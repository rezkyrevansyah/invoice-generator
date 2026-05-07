import type { FreelancerData, InvoiceFormData } from '@/lib/types';
import {
  formatRupiah,
  formatRupiahWords,
  formatDateID,
  formatDateLong,
} from '@/lib/utils';

interface InvoicePageProps {
  data: InvoiceFormData;
  freelancer: FreelancerData;
}

const CELL_LABEL: React.CSSProperties = {
  backgroundColor: '#E1F5EE',
  color: '#085041',
  fontWeight: 600,
  padding: '5px 10px',
  fontSize: '11px',
  whiteSpace: 'nowrap',
  border: '1px solid #c5e8da',
  verticalAlign: 'top',
};

const CELL_VALUE: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: '11px',
  border: '1px solid #e5e7eb',
  verticalAlign: 'top',
};

export default function InvoicePage({ data, freelancer }: InvoicePageProps) {
  const optA = data.paymentOption === 'A';
  const optB = data.paymentOption === 'B';

  const showOptA = data.paymentDisplay === 'both' || data.paymentDisplay === 'A';
  const showOptB = data.paymentDisplay === 'both' || data.paymentDisplay === 'B';

  const optAStyle: React.CSSProperties = optA
    ? { border: '2px solid #0F6E56', backgroundColor: '#E1F5EE', borderRadius: 8, padding: 10, marginBottom: 8 }
    : { border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 };

  const optBStyle: React.CSSProperties = optB
    ? { border: '2px solid #0F6E56', backgroundColor: '#E1F5EE', borderRadius: 8, padding: 10, marginBottom: 8 }
    : { border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 };

  return (
    <div className="page-break invoice-page" style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a', backgroundColor: '#fff', padding: '48px 60px', width: '794px', boxSizing: 'border-box' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '0.03em' }}>
          INVOICE &amp; WORK AGREEMENT
        </h1>
        <p style={{ fontSize: 11, fontStyle: 'italic', color: '#555', margin: '3px 0 6px' }}>
          Flexible Payment Options Available
        </p>
        <div style={{ height: 3, backgroundColor: '#0F6E56', borderRadius: 2 }} />
      </div>

      {/* ── SECTION 1: Info Dokumen ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={CELL_LABEL}>Invoice Number</td>
              <td style={CELL_VALUE}>{data.invoiceNumber || '—'}</td>
              <td style={CELL_LABEL}>Agreement Number</td>
              <td style={CELL_VALUE}>{data.agreementNumber || '—'}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Invoice Date</td>
              <td style={CELL_VALUE}>{formatDateID(data.invoiceDate)}</td>
              <td style={CELL_LABEL}>Agreement Date</td>
              <td style={CELL_VALUE}>{formatDateLong(data.agreementDate)}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Initial Payment Due</td>
              <td style={CELL_VALUE}>{formatDateID(data.initialPaymentDue)} <span style={{ color: '#888' }}>(1 hari kerja)</span></td>
              <td style={CELL_LABEL}>Project Deadline</td>
              <td style={CELL_VALUE}>{formatDateID(data.projectDeadline)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── SECTION 2: FROM | TO ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ ...CELL_LABEL, textAlign: 'left', width: '50%' }}>FROM</th>
              <th style={{ ...CELL_LABEL, textAlign: 'left', width: '50%' }}>TO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...CELL_VALUE, verticalAlign: 'top' }}>
                <div style={{ fontWeight: 700 }}>{freelancer.name}</div>
                <div style={{ color: '#555' }}>{freelancer.title}</div>
                <div style={{ fontStyle: 'italic', color: '#777' }}>Experience: {freelancer.experience}</div>
              </td>
              <td style={{ ...CELL_VALUE, verticalAlign: 'top' }}>
                <div style={{ fontWeight: 700 }}>{data.clientCompany || '—'}</div>
                <div style={{ color: '#555' }}>Attn: {data.clientPIC || '—'} (PIC)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── SECTION 3: Detail Project ───────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={{ ...CELL_LABEL, width: '28%' }}>Project Name</td>
              <td style={CELL_VALUE}>{data.projectName || '—'}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Scope of Work</td>
              <td style={{ ...CELL_VALUE, whiteSpace: 'pre-wrap' }}>{data.scopeOfWork || '—'}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Deliverables</td>
              <td style={{ ...CELL_VALUE, whiteSpace: 'pre-wrap' }}>{data.deliverables || '—'}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Revision Rounds</td>
              <td style={CELL_VALUE}>{data.revisionRounds} kali revisi</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Project Duration</td>
              <td style={CELL_VALUE}>{data.projectDuration} hari kerja</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Start Date</td>
              <td style={CELL_VALUE}>{formatDateID(data.startDate)}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>End Date</td>
              <td style={CELL_VALUE}>{formatDateID(data.endDate)}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Progress Updates</td>
              <td style={CELL_VALUE}>{data.progressUpdate}</td>
            </tr>
            <tr>
              <td style={{ ...CELL_LABEL, backgroundColor: '#0F6E56', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                PROJECT VALUE
              </td>
              <td style={{ ...CELL_VALUE, backgroundColor: '#E1F5EE', fontSize: 13, fontWeight: 700 }}>
                {formatRupiah(data.projectValue)}
                <span style={{ fontWeight: 400, fontSize: 11, color: '#555', marginLeft: 8 }}>
                  ({formatRupiahWords(data.projectValue)})
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PAYMENT OPTIONS ─────────────────────────────────────────────────── */}
      {(showOptA || showOptB) && (
        <div style={{ marginBottom: 12 }}>
          {/* Option A */}
          {showOptA && (
            <div style={optAStyle}>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: '#0F6E56' }}>
                {optA ? '☑' : '☐'} OPTION A: FULL PAYMENT 100%
              </div>
              <ul style={{ margin: '0 0 0 14px', padding: 0, fontSize: 10, color: '#333', lineHeight: 1.6 }}>
                <li>Total payment 100% sesuai nilai kontrak di atas dibayar di awal sebelum pekerjaan dimulai</li>
                <li>Project dapat langsung running setelah pembayaran terkonfirmasi</li>
                <li>Workflow tidak perlu berhenti di tengah jalan untuk menunggu pembayaran ke-2</li>
              </ul>
            </div>
          )}

          {/* Option B */}
          {showOptB && (
            <div style={optBStyle}>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: '#0F6E56' }}>
                {optB ? '☑' : '☐'} OPTION B: DOWN PAYMENT 50% + PELUNASAN 50%
              </div>
              <ul style={{ margin: '0 0 0 14px', padding: 0, fontSize: 10, color: '#333', lineHeight: 1.6 }}>
                <li>DP (Down Payment): 50% dari nilai kontrak dibayar di awal sebelum pekerjaan dimulai</li>
                <li>Pekerjaan dimulai setelah DP diterima</li>
                <li>Pembayaran ke-2 / pelunasan 50% dilakukan setelah progress 50% selesai</li>
                <li>Progress 50% berikutnya dilanjutkan setelah pelunasan diterima terlebih dahulu</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── INFO BOX KUNING ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#FFFBE6', border: '1px solid #ffe58f', borderLeft: '4px solid #faad14', borderRadius: 6, padding: '10px 12px', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 6 }}>
          💡 Mengapa Sistem Pembayaran Ini Aman untuk Client?
        </div>
        <ol style={{ margin: '0 0 0 14px', padding: 0, fontSize: 10, color: '#333', lineHeight: 1.7 }}>
          <li><strong>Work Agreement Mengikat Secara Hukum:</strong> Dokumen perjanjian ini dapat digunakan untuk proses hukum jika terjadi wanprestasi.</li>
          <li><strong>Track Record Terverifikasi:</strong> Pengalaman kerja dengan portfolio klien terpercaya yang dapat dicek.</li>
          <li><strong>Transparansi Penuh:</strong> Progress update rutin sesuai kesepakatan + akses preview secara berkala.</li>
          <li><strong>Standar Industri:</strong> Sistem DP atau upfront payment adalah praktik normal di freelance profesional untuk memastikan komitmen serius dari kedua belah pihak.</li>
        </ol>
      </div>

      {/* ── SECTION 4: Info Rekening ────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: '#085041' }}>
          Transfer ke Rekening:
        </div>
        <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={{ ...CELL_LABEL, width: 130 }}>Bank</td>
              <td style={CELL_VALUE}>: {freelancer.bank}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Nomor Rekening</td>
              <td style={{ ...CELL_VALUE, fontWeight: 700 }}>: {freelancer.accountNumber}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Nama Pemilik</td>
              <td style={CELL_VALUE}>: {freelancer.accountName}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── IMPORTANT NOTES ─────────────────────────────────────────────────── */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 10, color: '#444' }}>
        <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>IMPORTANT NOTES:</div>
        <ul style={{ margin: '0 0 0 14px', padding: 0, lineHeight: 1.7 }}>
          <li>Please SELECT ONE PAYMENT OPTION above and inform us via chat/email</li>
          <li>Initial payment must be completed within the specified due date above</li>
          <li>Please send payment proof via chat/email with selected payment option</li>
          <li>Work commences immediately after initial payment confirmation</li>
          <li>This invoice is valid in conjunction with the Work Agreement on page 2</li>
          <li>Legal protection applies per Indonesian law - see Work Agreement for complete terms</li>
        </ul>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', borderTop: '2px solid #0F6E56', paddingTop: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 12 }}>Thank you for your trust and business!</div>
        <div style={{ fontStyle: 'italic', fontSize: 11, color: '#555', marginTop: 2 }}>
          Looking forward to delivering excellent results
        </div>
      </div>

    </div>
  );
}
