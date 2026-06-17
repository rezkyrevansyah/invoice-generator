import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { formatRupiah } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 0;

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      invoice_date,
      client_company,
      project_name,
      project_value,
      payment_option,
      created_at,
      settlement_invoices (
        id,
        settlement_number
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-800">History Invoice</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Semua invoice yang tersimpan</p>
          </div>
        </div>
        <Link
          href="/generator"
          className="flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0F6E56' }}
        >
          <span className="sm:hidden">+ Baru</span>
          <span className="hidden sm:inline">+ Buat Invoice Baru</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 mb-4">
            Gagal memuat data: {error.message}
          </div>
        )}

        {!error && (!invoices || invoices.length === 0) && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#E1F5EE' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" style={{ color: '#0F6E56' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium mb-1">Belum ada invoice tersimpan</p>
            <p className="text-slate-400 text-sm mb-4">Buat invoice pertama Anda sekarang</p>
            <Link
              href="/generator"
              className="inline-flex px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ backgroundColor: '#0F6E56' }}
            >
              Buat Invoice
            </Link>
          </div>
        )}

        {invoices && invoices.length > 0 && (
          <div className="flex flex-col gap-3">
            {invoices.map((invoice) => {
              const settlements = (invoice.settlement_invoices ?? []) as { id: string; settlement_number: string }[];
              const hasSett = settlements.length > 0;
              const isOptB = invoice.payment_option === 'B';

              return (
                <div
                  key={invoice.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-slate-800">{invoice.invoice_number}</span>
                      {/* Status badge */}
                      {!isOptB && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                          Lunas
                        </span>
                      )}
                      {isOptB && !hasSett && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                          Belum Dilunasi
                        </span>
                      )}
                      {isOptB && hasSett && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                          Pelunasan Dibuat
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 truncate font-medium">{invoice.project_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {invoice.client_company} &middot; {new Date(invoice.invoice_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {isOptB && hasSett && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Settlement: {settlements[0].settlement_number}
                      </p>
                    )}
                  </div>

                  {/* Value */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#0F6E56' }}>
                      {formatRupiah(invoice.project_value)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {invoice.payment_option === 'A' ? 'Full Payment' : 'DP 50% + Pelunasan 50%'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link
                      href={`/invoice/${invoice.id}`}
                      className="px-4 py-2 text-xs font-medium text-slate-600 rounded-xl text-center border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Lihat &amp; Edit
                    </Link>
                    {isOptB && !hasSett && (
                      <Link
                        href={`/settlement?id=${invoice.id}`}
                        className="px-4 py-2 text-xs font-semibold text-white rounded-xl text-center transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#0F6E56' }}
                      >
                        Buat Invoice Pelunasan
                      </Link>
                    )}
                    {isOptB && hasSett && (
                      <Link
                        href={`/settlement?id=${invoice.id}`}
                        className="px-4 py-2 text-xs font-medium text-slate-600 rounded-xl text-center border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        Lihat Pelunasan
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
