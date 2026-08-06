import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Hardcoded representative holidays matching the prompt & visual mockup
const HOLIDAYS = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-26', name: "Republic Day" },
  { date: '2026-03-03', name: 'Holi' },
  { date: '2026-03-19', name: 'Good Friday' },
  { date: '2026-04-08', name: 'Idul-Fitr' },
  { date: '2026-08-15', name: 'Independence Day' },
  { date: '2026-10-02', name: 'Gandhi Jayanti' },
  { date: '2026-12-25', name: 'Christmas Day' }
];

export const LeaveCalendar = ({ selectedFrom, selectedTo, leaveRequests = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate days grid
  const daysInMonth = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday
    
    const days = [];
    
    // Fill padding days for start of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ padding: true, key: `pad-start-${i}` });
    }
    
    // Generate dates
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(year, month, day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      
      // Check if matches a public holiday
      const holiday = HOLIDAYS.find(h => h.date === dateString);
      
      // Check if selected range
      let isSelected = false;
      if (selectedFrom && selectedTo) {
        const start = new Date(selectedFrom);
        const end = new Date(selectedTo);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        dateObj.setHours(0,0,0,0);
        isSelected = dateObj >= start && dateObj <= end;
      }

      // Check if approved or pending leaves
      const approvedLeave = leaveRequests.find(req => {
        if (req.leave_status !== 'Approved') return false;
        const from = new Date(req.leave_from);
        const to = new Date(req.leave_to);
        from.setHours(0,0,0,0);
        to.setHours(0,0,0,0);
        dateObj.setHours(0,0,0,0);
        return dateObj >= from && dateObj <= to;
      });

      const pendingLeave = leaveRequests.find(req => {
        if (req.leave_status !== 'Pending') return false;
        const from = new Date(req.leave_from);
        const to = new Date(req.leave_to);
        from.setHours(0,0,0,0);
        to.setHours(0,0,0,0);
        dateObj.setHours(0,0,0,0);
        return dateObj >= from && dateObj <= to;
      });

      days.push({
        padding: false,
        day,
        dateString,
        isWeekend,
        holiday,
        isSelected,
        isApproved: !!approvedLeave,
        isPending: !!pendingLeave,
        isToday: new Date().toDateString() === dateObj.toDateString(),
        key: `day-${day}`
      });
    }

    return days;
  }, [year, month, selectedFrom, selectedTo, leaveRequests]);

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
          <CalendarIcon size={16} className="text-blue-500" />
          {monthNames[month]} {year}
        </h4>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Titles */}
      <div className="grid grid-cols-7 text-center gap-1 mb-2">
        {weekdays.map((w, idx) => (
          <span key={idx} className="text-[10px] font-black text-slate-400 select-none">
            {w}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs">
        {daysInMonth.map((cell) => {
          if (cell.padding) {
            return <div key={cell.key} className="p-2 text-transparent" />;
          }

          // Compute cell classes
          let cellStyle = 'relative p-2 rounded-xl flex flex-col items-center justify-center h-10 select-none transition-all duration-200 ';
          let labelStyle = 'text-slate-700 ';

          if (cell.isToday) {
            cellStyle += 'border border-blue-500 bg-blue-50/30 ';
            labelStyle = 'text-blue-700 font-extrabold ';
          }
          
          if (cell.isWeekend) {
            cellStyle += 'bg-slate-50 ';
            labelStyle = cell.isToday ? labelStyle : 'text-slate-400 ';
          }

          if (cell.isSelected) {
            cellStyle += 'bg-blue-600 shadow-sm shadow-blue-500/10 ';
            labelStyle = 'text-white font-extrabold ';
          } else if (cell.isApproved) {
            cellStyle += 'bg-emerald-50 border border-emerald-100 ';
            labelStyle = 'text-emerald-700 font-bold ';
          } else if (cell.isPending) {
            cellStyle += 'bg-amber-50 border border-amber-100 ';
            labelStyle = 'text-amber-700 font-bold ';
          }

          return (
            <div
              key={cell.key}
              className={cellStyle}
              title={cell.holiday ? `${cell.holiday.name} (Public Holiday)` : cell.isApproved ? 'Approved Leave' : cell.isPending ? 'Pending Approval' : ''}
            >
              <span className={labelStyle}>{cell.day}</span>
              
              {/* Overlay indicators */}
              {cell.holiday && !cell.isSelected && (
                <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 px-1 text-[7px] font-bold bg-blue-500 text-white rounded uppercase scale-90">
                  HOL
                </span>
              )}

              {/* Mini dots indicator (if approved/pending and not selected) */}
              {!cell.holiday && !cell.isSelected && (cell.isApproved || cell.isPending) && (
                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  cell.isApproved ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[9px] font-black uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
