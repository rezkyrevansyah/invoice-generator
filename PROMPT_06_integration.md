Baca file `PROJECT_CONTEXT.md` di root folder ini sebagai referensi utama.

Semua file dari PROMPT_01–05 sudah ada. Ini prompt terakhir untuk melengkapi semua fungsionalitas.

---

Buat `components/PrintButton.tsx` dan update `app/generator/page.tsx` untuk integrasi final.

---

### `components/PrintButton.tsx`

Props: tidak ada (standalone component).

Spesifikasi:
- Tombol utama: "🖨️ Download PDF / Print"
- `className="no-print"` pada seluruh komponen ini (tombol + modal + overlay)
- `onClick` tombol: set state `showModal = true`

Modal instruksi (muncul sebelum print):
- Overlay semi-transparent di belakang (full screen, z-index tinggi)
- Modal card putih, centered
- Judul: "Cara Menyimpan sebagai PDF"
- 5 langkah instruksi (render sebagai numbered list):
  1. Pastikan browser Anda dalam mode desktop
  2. Di dialog Print yang muncul, pilih **Save as PDF** sebagai printer
  3. Set **Paper size: A4**
  4. Set **Margins: Minimum** atau **None**
  5. Aktifkan opsi **"Print background graphics"** (di More settings)
- 2 tombol:
  - "Batal" → tutup modal
  - "Mengerti, lanjut print" (warna `#0F6E56`) → tutup modal + `window.print()`
- Modal dan overlay harus punya `className="no-print"`

---

### Update `app/generator/page.tsx`

Integrasikan semua komponen. Final state di page.tsx:
```tsx
const [currentStep, setCurrentStep] = useState(1)
const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData)
const [freelancerData, setFreelancerData] = useLocalStorage<FreelancerData>('freelancer-data', defaultFreelancerData)
const [errors, setErrors] = useState<string[]>([])
```

Handler `onChange`:
```tsx
const handleChange = (field: keyof InvoiceFormData, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}
```

Handler `onUpdateFreelancer`:
```tsx
const handleUpdateFreelancer = (data: FreelancerData) => {
  setFreelancerData(data)
}
```

Handler navigasi:
```tsx
const handleNext = () => {
  const errs = validateStep(currentStep, formData)
  if (errs.length > 0) { setErrors(errs); return }
  setErrors([])
  setCurrentStep(prev => prev + 1)
}
const handleBack = () => {
  setErrors([])
  setCurrentStep(prev => prev - 1)
}
```

Layout final:
```tsx
<main className="flex flex-col lg:flex-row min-h-screen">
  {/* Form Panel */}
  <div className="form-panel no-print lg:w-[45%] ...">
    <Stepper currentStep={currentStep} />
    
    {/* Render step aktif */}
    {currentStep === 1 && <StepInfo data={formData} onChange={handleChange} />}
    {currentStep === 2 && <StepClient data={formData} onChange={handleChange} />}
    {currentStep === 3 && <StepProject data={formData} onChange={handleChange} />}
    {currentStep === 4 && (
      <StepPayment
        data={formData}
        onChange={handleChange}
        freelancerData={freelancerData}
        onUpdateFreelancer={handleUpdateFreelancer}
      />
    )}

    {/* Error messages */}
    {errors.length > 0 && (
      <div className="...text-red...">
        {errors.map((e, i) => <p key={i}>{e}</p>)}
      </div>
    )}

    {/* Navigasi */}
    <div className="no-print flex justify-between ...">
      <button onClick={handleBack} disabled={currentStep === 1}>Kembali</button>
      {currentStep < 4
        ? <button onClick={handleNext}>Lanjut →</button>
        : <button onClick={handleNext}>Lihat Preview Penuh / Print</button>
      }
    </div>
  </div>

  {/* Preview Panel */}
  <div className="lg:w-[55%] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ...">
    <PrintButton />
    <DocumentPreview data={formData} freelancer={freelancerData} />
  </div>
</main>
```

Setelah selesai, verifikasi checklist berikut dan konfirmasi hasilnya:
- [ ] Preview update realtime saat ketik di form (DocumentPreview menerima formData langsung)
- [ ] Auto-generate nomor invoice saat halaman pertama load
- [ ] Checkbox payment option di preview reflect pilihan user
- [ ] Print hanya menampilkan preview, semua elemen dengan `className="no-print"` tersembunyi
- [ ] Tidak ada TypeScript error (`strict: true`)
- [ ] Tidak ada `console.error` saat runtime normal

Tampilkan PrintButton.tsx dan page.tsx yang sudah diupdate secara lengkap.
