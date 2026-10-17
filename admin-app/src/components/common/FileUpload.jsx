import React, { useId, useRef, useState } from 'react';
import { uploadService } from '../../services/uploadService';
import {
  getPublicFileUrl,
  isPublicFileUrl,
  isPublicImageUrl,
  isPublicResumeUrl,
} from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiXMark,
  HiOutlineCheck,
} from 'react-icons/hi2';

const DEFAULT_MAX_FILE_SIZE_MB = Math.max(
  1,
  Number.parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE_MB || '5', 10) || 5
);

export default function FileUpload({
  label = 'Upload File',
  accept = 'image/*,application/pdf',
  value = '',
  onChange,
  onFileInfoChange,
  helperText = 'Supported formats: JPG, PNG, WEBP, PDF (Max 5MB)',
  isImage = false,
  uploadType,
  fileName = '',
  onFileNameChange,
  onUploadStateChange,
  maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  showUrlInput = true,
}) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef(null);
  const uploadingRef = useRef(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadingRef.current) return;
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds the ${maxFileSizeMB}MB limit.`);
      e.target.value = '';
      return;
    }
    try {
      uploadingRef.current = true;
      setUploading(true);
      onUploadStateChange?.(true);
      if (uploadType === 'resume') {
        const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
        const isPdfMimeType = file.type === 'application/pdf';
        const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
        const isPdfContent = String.fromCharCode(...header) === '%PDF-';
        if (!isPdfExtension || !isPdfMimeType || !isPdfContent) {
          toast.error('Invalid resume file. Select a valid PDF document.');
          return;
        }
      }

      const res = await uploadService.uploadFile(file, uploadType);
      if (!res.data?.fileUrl) {
        throw new Error('Upload completed without a public file URL.');
      }
      if (file.type.startsWith('image/') && !isPublicImageUrl(res.data.fileUrl)) {
        throw new Error('The upload service returned an invalid public image URL. Please try again.');
      }
      onChange(res.data.fileUrl);
      onFileNameChange?.(res.data.fileName || file.name);
      if (onFileInfoChange) {
        onFileInfoChange({
          fileName: res.data.fileName,
          fileSize: res.data.fileSize,
          fileUrl: res.data.fileUrl,
        });
      }
      toast.success(uploadType === 'resume' ? 'Resume PDF uploaded successfully.' : 'File uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'File upload failed');
    } finally {
      uploadingRef.current = false;
      setUploading(false);
      onUploadStateChange?.(false);
      e.target.value = '';
    }
  };

  const handleClear = () => {
    if (uploadingRef.current) return;
    onChange('');
    onFileNameChange?.('');
    if (onFileInfoChange) {
      onFileInfoChange({ fileName: '', fileSize: '', fileUrl: '' });
    }
  };

  const fileIsImage = isImage || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value);
  const displayName = fileName || (uploadType === 'resume' ? 'Faculty Resume PDF' : value);
  const publicFileUrl = (uploadType === 'resume' ? isPublicResumeUrl(value) : isPublicFileUrl(value))
    ? getPublicFileUrl(value)
    : '';

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            {fileIsImage ? (
              <>
                <img
                  src={publicFileUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 bg-slate-900 shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span
                  role="status"
                  className="hidden w-12 h-12 rounded-lg border border-rose-500/30 bg-rose-500/10 text-[9px] text-center text-rose-300 items-center justify-center shrink-0 flex"
                >
                  Preview unavailable
                </span>
              </>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                <HiOutlineDocumentText className="text-2xl" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-0.5">
                <HiOutlineCheck />
                <span>{uploading ? 'Uploading replacement...' : 'Uploaded'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {uploadType === 'resume' && publicFileUrl && !uploading && (
              <a
                href={publicFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 text-xs font-semibold text-gold-400 hover:text-gold-300"
              >
                Preview
              </a>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={uploading}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
              title="Remove file"
            >
              <HiXMark className="text-lg" />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-gold-500/60 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-all group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-300">Uploading file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-gold-400 group-hover:border-gold-500/40 flex items-center justify-center transition-colors">
                {isImage ? <HiOutlinePhoto className="text-xl" /> : <HiOutlineCloudArrowUp className="text-xl" />}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-gold-400 font-semibold underline underline-offset-2">Click to browse</span>{' '}
                  or drag & drop
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </label>
      )}

      {showUrlInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste external/relative URL here (e.g., /uploads/...)"
            className="w-full px-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 placeholder-slate-400 focus:outline-none focus:border-gold-500/50"
          />
        </div>
      )}
    </div>
  );
}
