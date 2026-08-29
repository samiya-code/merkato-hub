import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Check } from 'lucide-react';

export const FileUpload = ({
  label,
  accept = 'image/*',
  value,
  onChange,
  hint = 'Recommended: 512×512px SVG or PNG (Max 5MB)',
  className = '',
}) => {
  const [preview, setPreview] = useState(value || '');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setPreview(fakeUrl);
      if (onChange) onChange(fakeUrl, file);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-colors rounded-xl p-5 text-center bg-slate-50/50 hover:bg-emerald-50/20 cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {preview ? (
          <div className="flex items-center justify-center gap-3">
            <img src={preview} alt="Uploaded" className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs" />
            <div className="text-left text-xs">
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> File Selected
              </span>
              <p className="text-slate-400 mt-0.5">Click or drag to replace</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl mb-2">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</p>
            {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
