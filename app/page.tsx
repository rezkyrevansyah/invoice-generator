import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Invoice Generator</h1>
          <p className="text-slate-500 mt-1 text-sm">Pilih jenis invoice yang ingin dibuat</p>
        </div>

        {/* Pilihan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kartu 1: Invoice Baru */}
          <Link
            href="/generator"
            className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-md transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#E1F5EE' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: '#0F6E56' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-1">Buat Invoice Baru</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Invoice + Work Agreement untuk proyek baru. Termasuk DP dan deadline.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-sm font-semibold" style={{ color: '#0F6E56' }}>
              Mulai
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Kartu 2: Invoice Pelunasan */}
          <Link
            href="/settlement"
            className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-md transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#E1F5EE' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: '#0F6E56' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-1">Invoice Pelunasan</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Untuk proyek yang sudah dibayar DP 50%. Bisa tambah reimbursement dan bukti gambar.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-sm font-semibold" style={{ color: '#0F6E56' }}>
              Mulai
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Link ke history */}
        <div className="text-center mt-6">
          <Link href="/history" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            Lihat History Invoice →
          </Link>
        </div>
      </div>
    </main>
  );
}
