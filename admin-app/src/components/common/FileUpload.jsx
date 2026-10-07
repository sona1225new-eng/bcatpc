import React, { useState } from 'react';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../context/ToastContext';
import {
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiXMark,
  HiOutlineCheck,
} from 'react-icons/hi2';

export default function FileUpload({
  label = 'Upload File',
  accept = 'image/*,application/pdf',
  value = '',
  onChange,
  onFileInfoChange,
  helperText = 'Supported formats: JPG, PNG, WEBP, PDF (Max 5MB)',
  isImage = false,
}) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    try {
      setUploading(true);
      const res = await uploadService.uploadFile(file);
      if (res.data?.fileUrl) {
        onChange(res.data.fileUrl);
        if (onFileInfoChange) {
          onFileInfoChange({
            fileName: res.data.fileName,
            fileSize: res.data.fileSize,
            fileUrl: res.data.fileUrl,
          });
        }
        toast.success('File uploaded successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onFileInfoChange) {
      onFileInfoChange({ fileName: '', fileSize: '', fileUrl: '' });
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label}
      </label>

      {/* If file is already selected/uploaded */}
      {value ? (
        <div className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage || value.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
              <img
                src={value.startsWith('http') ? value : value}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-700 bg-slate-900 shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <HiOutlineDocumentText className="text-2xl" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{value}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-0.5">
                <HiOutlineCheck />
                <span>Uploaded</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors ml-2"
            title="Remove file"
          >
            <HiXMark className="text-lg" />
          </button>
        </div>
      ) : (
        /* Upload Area */
        <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-blue-500/60 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl cursor-pointer transition-all group">
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-300">Uploading file...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/40 flex items-center justify-center transition-colors">
                {isImage ? (
                  <HiOutlinePhoto className="text-xl" />
                ) : (
                  <HiOutlineCloudArrowUp className="text-xl" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-blue-400 font-semibold underline underline-offset-2">
                    Click to browse
                  </span>{' '}
                  or drag & drop
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </label>
      )}

      {/* Manual URL input fallback */}
      <div className="pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste external/relative URL here (e.g., /uploads/...)"
          className="w-full px-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
      </div>
    </div>
  );
}
