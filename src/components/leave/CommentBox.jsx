import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export const CommentBox = ({ value, onChange }) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 250) {
      setCharCount(text.length);
      if (onChange) onChange(text);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor="comments" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Comments / Remarks</label>
        <span className="text-[10px] font-bold text-slate-400">{charCount} / 250 chars</span>
      </div>
      <div className="relative">
        <textarea
          id="comments"
          value={value}
          onChange={handleTextChange}
          placeholder="Provide optional additional notes or context..."
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 pr-10 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 min-h-[100px] resize-none"
        />
        <div className="absolute top-4 right-3 text-slate-400 pointer-events-none">
          <MessageSquare size={16} />
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
