import type { FreelancerData, SettlementFormData } from '@/lib/types';
import {
  formatRupiah,
  formatRupiahWords,
  formatDateID,
} from '@/lib/utils';

interface Props {
  data: SettlementFormData;
  freelancer: FreelancerData;
  previewImageUrls?: string[]; // blob URLs for preview before upload
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

export default function SettlementInvoicePage({ data, freelancer, previewImageUrls }: Props) {
  const reimbursementTotal = data.reimbursementItems.reduce((sum, i) => sum + i.amount, 0);
  const grandTotal = data.remainingAmount + reimbursementTotal;
  const imageUrls = previewImageUrls && previewImageUrls.length > 0 ? previewImageUrls : data.imageUrls;

  return (
    <div
      className="settlement-invoice-page"
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
        backgroundColor: '#fff',
        padding: '48px 60px',
        width: '794px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '0.03em' }}>
          INVOICE PELUNASAN
        </h1>
        <p style={{ fontSize: 11, fontStyle: 'italic', color: '#555', margin: '3px 0 6px' }}>
          Settlement Invoice
        </p>
        <div style={{ height: 3, backgroundColor: '#0F6E56', borderRadius: 2 }} />
      </div>

      {/* ── INFO DOKUMEN ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={CELL_LABEL}>Settlement Number</td>
              <td style={CELL_VALUE}>{data.settlementNumber || '—'}</td>
              <td style={CELL_LABEL}>Settlement Date</td>
              <td style={CELL_VALUE}>{formatDateID(data.settlementDate)}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Referensi Invoice</td>
              <td style={{ ...CELL_VALUE, fontWeight: 600 }}>{data.originalInvoiceNumber || '—'}</td>
              <td style={{ ...CELL_LABEL, borderColor: 'transparent', backgroundColor: 'transparent' }} />
              <td style={{ ...CELL_VALUE, borderColor: 'transparent' }} />
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── FROM / TO ───────────────────────────────────────────────────────── */}
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

      {/* ── PROJECT ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={{ ...CELL_LABEL, width: '28%' }}>Project Name</td>
              <td style={CELL_VALUE}>{data.projectName || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── RINCIAN PEMBAYARAN ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: '#085041' }}>
          RINCIAN PEMBAYARAN
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={{ ...CELL_LABEL, width: '60%' }}>Total Nilai Project</td>
              <td style={CELL_VALUE}>{formatRupiah(data.projectValue)}</td>
            </tr>
            <tr>
              <td style={{ ...CELL_LABEL, color: '#555', fontWeight: 400 }}>
                DP yang Telah Dibayar
                {data.projectValue > 0 && data.dpAmount > 0
                  ? ` (${Math.round((data.dpAmount / data.projectValue) * 100)}%)`
                  : ''}
              </td>
              <td style={{ ...CELL_VALUE, color: '#555' }}>
                ({formatRupiah(data.dpAmount)})
              </td>
            </tr>
            <tr>
              <td style={{ ...CELL_LABEL, fontWeight: 700 }}>
                Sisa Pelunasan
                {data.projectValue > 0 && data.remainingAmount > 0
                  ? ` (${Math.round((data.remainingAmount / data.projectValue) * 100)}%)`
                  : ''}
              </td>
              <td style={{ ...CELL_VALUE, fontWeight: 700 }}>{formatRupiah(data.remainingAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── REIMBURSEMENT (optional) ────────────────────────────────────────── */}
      {data.reimbursementItems.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: '#085041' }}>
            RINCIAN REIMBURSEMENT
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <tbody>
              {data.reimbursementItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ ...CELL_VALUE, width: '60%' }}>{item.description}</td>
                  <td style={CELL_VALUE}>{formatRupiah(item.amount)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...CELL_LABEL, fontWeight: 700 }}>Subtotal Reimbursement</td>
                <td style={{ ...CELL_VALUE, fontWeight: 700 }}>{formatRupiah(reimbursementTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── GRAND TOTAL ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={{ ...CELL_LABEL, backgroundColor: '#0F6E56', color: '#fff', fontSize: 12, fontWeight: 700, width: '60%' }}>
                TOTAL TAGIHAN
              </td>
              <td style={{ ...CELL_VALUE, backgroundColor: '#E1F5EE', fontSize: 13, fontWeight: 700 }}>
                {formatRupiah(grandTotal)}
              </td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Terbilang</td>
              <td style={{ ...CELL_VALUE, fontStyle: 'italic', color: '#444' }}>
                {formatRupiahWords(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── BANK INFO ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4, color: '#085041' }}>
          Transfer ke Rekening:
        </div>
        <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            <tr>
              <td style={{ ...CELL_LABEL, width: 130 }}>Bank</td>
              <td style={CELL_VALUE}>: {data.bank}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Nomor Rekening</td>
              <td style={{ ...CELL_VALUE, fontWeight: 700 }}>: {data.accountNumber}</td>
            </tr>
            <tr>
              <td style={CELL_LABEL}>Nama Pemilik</td>
              <td style={CELL_VALUE}>: {data.accountName}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── BUKTI REIMBURSEMENT (optional) ──────────────────────────────────── */}
      {imageUrls.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 8, color: '#085041' }}>
            BUKTI REIMBURSEMENT
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
            }}
          >
            {imageUrls.map((url, i) => (
              <div
                key={i}
                className="settlement-proof-image"
                style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Bukti ${i + 1}`}
                  style={{
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'contain',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
