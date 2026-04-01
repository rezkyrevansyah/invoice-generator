Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama.

Semua file dari PROMPT_01–06 sudah ada dan berjalan lokal tanpa error.

---

Bantu saya deploy project Next.js 16 ini ke Vercel.

**Konteks project:**
- Next.js 16 App Router + Tailwind CSS v4 + TypeScript
- Tidak ada environment variables
- Tidak ada database atau backend
- Pure frontend + localStorage

**Yang perlu dihasilkan:**

1. **Tailwind CSS v4 tidak membutuhkan `tailwind.config.ts`** — content detection otomatis. Cukup pastikan `globals.css` memiliki `@import "tailwindcss"` dan `postcss.config.mjs` menggunakan `@tailwindcss/postcss`. Jika ada `tailwind.config.ts` lama, hapus saja.

2. **Cek `next.config.js` atau `next.config.ts`** — pastikan tidak ada konfigurasi yang akan menyebabkan error di Vercel. Tampilkan file yang sudah benar.

3. **Buat `vercel.json`** di root jika diperlukan. Jika tidak diperlukan untuk setup ini, jelaskan kenapa.

4. **Berikan instruksi deploy step by step:**
   - Push ke GitHub repo baru (perintah git yang perlu dijalankan)
   - Import di Vercel (apa yang perlu di-set, apa yang bisa dibiarkan default)
   - Verifikasi build berhasil

5. **Antisipasi masalah umum:**
   - Jika ada Tailwind class yang hilang di production (purge), cara mengatasinya
   - Jika ada SSR error terkait localStorage, cara mengatasinya
   - Jika build gagal karena TypeScript strict error, cara mengatasinya

Tampilkan semua file config yang perlu dibuat atau diupdate, beserta instruksi deploy yang lengkap.
