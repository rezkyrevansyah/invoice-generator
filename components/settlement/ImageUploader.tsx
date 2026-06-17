'use client';
import { useRef, useState } from 'react';

interface Props {
  files: File[];
  uploadedUrls: string[];
  onFilesChange: (files: File[]) => void;
  onRemoveUploaded: (url: string) => void;
  isUploading: boolean;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const ACCEPTED_ACCEPT = 'image/jpeg,image/png,application/pdf';

function isPdf(fileOrUrl: File | string) {
  if (typeof fileOrUrl === 'string') return fileOrUrl.toLowerCase().includes('.pdf') || fileOrUrl.toLowerCase().includes('%2f') && fileOrUrl.toLowerCase().endsWith('.pdf');
  return fileOrUrl.type === 'application/pdf';
}

function PdfIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6M9 17h4" />
    </svg>
  );
}

export default function ImageUploader({
  files,
  uploadedUrls,
  onFilesChange,
  onRemoveUploaded,
  isUploading,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  function validateAndAdd(incoming: FileList | null) {
    if (!incoming) return;
    const errs: string[] = [];
    const valid: File[] = [];
    Array.from(incoming).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errs.push(`${file.name}: hanya JPEG, PNG, atau PDF yang didukung`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`${file.name}: ukuran melebihi ${MAX_SIZE_MB}MB`);
      } else {
        valid.push(file);
      }
    });
    setErrors(errs);
    if (valid.length > 0) onFilesChange([...files, ...valid]);
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    validateAndAdd(e.dataTransfer.files);
  }

  const totalCount = files.length + uploadedUrls.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          Bukti Reimbursement <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        {totalCount > 0 && (
          <span className="text-xs text-slate-400">{totalCount} file</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer transition-colors hover:border-slate-300"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="text-xs text-slate-500">
          Drag &amp; drop atau <span className="font-semibold" style={{ color: '#0F6E56' }}>klik untuk pilih</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">JPEG · PNG · PDF &nbsp;·&nbsp; Maks {MAX_SIZE_MB}MB per file</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => validateAndAdd(e.target.files)}
        />
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-100">
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-red-600">{e}</p>
          ))}
        </div>
      )}

      {/* Pending files preview */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white"
              style={{ aspectRatio: '1' }}
            >
              {isPdf(file) ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2" style={{ color: '#dc2626' }}>
                  <PdfIcon />
                  <p className="text-xs text-slate-500 text-center truncate w-full px-1">{file.name}</p>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/40 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{file.name}</p>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 shadow text-slate-600 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Already-uploaded URLs */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {uploadedUrls.map((url, index) => {
            const pdf = url.toLowerCase().endsWith('.pdf');
            return (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white"
                style={{ aspectRatio: '1' }}
              >
                {pdf ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center gap-1 p-2"
                    style={{ color: '#dc2626' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PdfIcon />
                    <p className="text-xs text-slate-500 text-center">Buka PDF</p>
                  </a>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveUploaded(url)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 shadow text-slate-600 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isUploading && (
        <p className="text-xs text-slate-500 text-center">Mengupload file...</p>
      )}
    </div>
  );
}
