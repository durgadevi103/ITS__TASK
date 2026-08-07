import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, Image } from 'lucide-react';

export const AttachmentUpload = ({ onChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (onChange) onChange(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  const triggerInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Attachment <span className="text-slate-400 font-normal">(Optional)</span></label>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />

      {!file ? (
        <button
          type="button"
          onClick={triggerInput}
          className="w-full border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer text-slate-500 hover:text-blue-600"
        >
          <UploadCloud size={20} className="text-slate-400" />
          <span className="text-xs font-extrabold">+ Upload File</span>
          <span className="text-[9px] text-slate-400 font-medium">PDF, PNG, JPG, DOC up to 5MB</span>
        </button>
      ) : (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              {file.type?.startsWith('image/') ? <Image size={15} /> : <File size={15} />}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-700 truncate">{file.name}</p>
              <p className="text-[9px] text-slate-400 font-semibold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition cursor-pointer"
            title="Remove File"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;
