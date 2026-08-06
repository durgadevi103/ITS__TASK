import React from 'react';
import { Loader2, Send, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LeaveButtons = ({ onCancel, isSubmitting = false, submitLabel = 'Submit Request' }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
      {/* Cancel Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-5 py-3 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-extrabold text-sm rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        <XCircle size={16} />
        Cancel
      </motion.button>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-80"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send size={16} />
            {submitLabel}
          </>
        )}
      </motion.button>
    </div>
  );
};

export default LeaveButtons;
