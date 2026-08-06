import React from 'react';
import { User, ShieldCheck, Mail, Briefcase, Award } from 'lucide-react';

export const EmployeeCard = ({ employee }) => {
  const name = employee?.emp_name || employee?.fullName || employee?.username || 'Guest Employee';
  const id = employee?.emp_id || employee?.employee_id || 'EMP102';
  const dept = employee?.emp_dept || 'Engineering';
  const desig = employee?.emp_designation || employee?.emp_desigation || 'Senior Frontend Engineer';
  const email = employee?.emp_email || employee?.email || 'employee@company.com';
  const managerName = employee?.emp_manager || 'Srinivasan Raman'; // Representative senior manager

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-2xl rounded-full" />
      
      <div className="flex items-start gap-4">
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm" title="Active Account">
            <ShieldCheck size={12} />
          </div>
        </div>

        {/* Employee Identity details */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-base font-extrabold text-slate-800 tracking-tight">{name}</h4>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              ID: {id}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Mail size={12} className="text-slate-400" />
            <span>{email}</span>
          </div>
        </div>
      </div>

      {/* Structured Details Grid */}
      <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Briefcase size={12} className="text-blue-500" />
            {dept}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Designation</span>
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Award size={12} className="text-indigo-500" />
            {desig}
          </span>
        </div>
      </div>

      {/* Reporting Manager details */}
      <div className="bg-slate-50 rounded-2xl p-3 mt-4 border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Reporting Manager</span>
          <span className="text-xs font-bold text-slate-700">{managerName}</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
          SR
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
