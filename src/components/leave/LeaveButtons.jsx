import React from 'react';
import { Loader2, Send, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LeaveButtons = ({ onCancel, isSubmitting = false, submitLabel = 'Submit Request' }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100">
      {/* Cancel Button */}
      <motion.button
        whileHover={{ y: -1.5, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-4 py-2 glossy-button-secondary text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        <XCircle size={14} className="text-slate-400 group-hover:text-slate-650" />
        Cancel
      </motion.button>

      {/* Submit Button */}
      <motion.button
        whileHover={{ y: -1.5, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-5 py-2.5 glossy-button-primary text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-80"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send size={14} />
            {submitLabel}
          </>
        )}
      </motion.button>
    </div>
  );
};

export default LeaveButtons;
