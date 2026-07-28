import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  MoreVertical,
  Edit,
  Trash,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import api from '../../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [newHiresCount, setNewHiresCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live stats from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let employeesList = [];

        // Fetch employees
        try {
          const empRes = await api.get('/employee/list');
          if (empRes.data.success && empRes.data.list) {
            employeesList = empRes.data.list;
            setEmployees(employeesList);
            setEmployeeCount(employeesList.length);
            
            // Count new hires (simulated based on newest employee additions)
            const recentNum = Math.min(5, employeesList.length);
            setNewHiresCount(recentNum);
          }
        } catch (err) {
          console.error("Error fetching employees", err);
        }

        // Fetch departments
        try {
          const deptRes = await api.get('/department/list/100/0');
          const listData = deptRes.data.data || deptRes.data.list;
          if (deptRes.data.success && listData) {
            setDepartments(listData);
            setDeptCount(listData.length);
          } else {
            const deptResAlt = await api.get('/department/list');
            const listDataAlt = deptResAlt.data.list || deptResAlt.data.data;
            if (deptResAlt.data.success && listDataAlt) {
              setDepartments(listDataAlt);
              setDeptCount(listDataAlt.length);
            }
          }
        } catch (err) {
          console.error("Error fetching departments", err);
          // Fallback to local session departments if any
          const local = sessionStorage.getItem('departmentsData');
          if (local) {
            const parsed = JSON.parse(local);
            setDepartments(parsed);
            setDeptCount(parsed.length);
          } else {
            setDeptCount(3); // Mock length
          }
        }

        // Generate recent updates list from actual database employees
        if (employeesList.length > 0) {
          // Sort by employee_id desc to get newest updates
          const sorted = [...employeesList].sort((a, b) => b.employee_id - a.employee_id);
          const today = new Date();
          const mappedUpdates = sorted.slice(0, 4).map((emp, idx) => ({
            name: emp.emp_name,
            department: emp.emp_dept || 'General',
            position: emp.emp_desigation || 'Executive',
            date: new Date(today.getTime() - idx * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: idx % 2 === 0 ? 'New Hire' : 'Promoted',
            avatar: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.emp_name)}&background=2563eb&color=fff&bold=true`
          }));
          setRecentUpdates(mappedUpdates);
        } else {
          // Fallback static mock updates if db empty
          setRecentUpdates([
            { name: 'Jane Doe', department: 'Marketing', position: 'Marketing Specialist', date: 'May 15, 2025', status: 'New Hire' },
            { name: 'Mike Smith', department: 'Finance', position: 'Financial Analyst', date: 'May 16, 2025', status: 'Promoted' }
          ]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data from backend", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute department statistics dynamically
  const deptStats = useMemo(() => {
    if (employees.length === 0) return [];
    const counts = {};
    employees.forEach(emp => {
      const dName = emp.emp_dept || 'General';
      counts[dName] = (counts[dName] || 0) + 1;
    });

    return Object.keys(counts).map(name => ({
      name,
      count: counts[name],
      percentage: Math.round((counts[name] / employees.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [employees]);

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen space-y-6 text-slate-800 animate-in fade-in duration-200">
      
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Welcome back! Here's an overview of your organization.</p>
        </div>
        
        {/* Timeframe Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="bg-white border border-slate-200 rounded-xl pl-4 pr-9 py-2 text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>All Time</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Total Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Employees</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-950">{employeeCount}</span>
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp size={10} />
              +5%
            </span>
          </div>
        </div>

        {/* New Hires */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Hires</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-950">{newHiresCount}</span>
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp size={10} />
              +10%
            </span>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-slate-950">
              {String(deptCount).padStart(2, '0')}
            </span>
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100">
              No change
            </span>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Overview Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-slate-800 text-sm">Attendance Overview</h2>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Present</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />Absent</span>
              </div>
            </div>
            <div className="relative">
              <select className="bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200/40 outline-none transition cursor-pointer appearance-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown size={12} className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          {/* Responsive SVG Line Chart */}
          <div className="relative w-full h-64 pt-6 select-none">
            <svg viewBox="0 0 700 240" className="w-full h-full">
              {/* Definitions for area gradients */}
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="20" x2="670" y2="20" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="50" y1="60" x2="670" y2="60" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="50" y1="100" x2="670" y2="100" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="50" y1="140" x2="670" y2="140" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="50" y1="180" x2="670" y2="180" stroke="#f1f5f9" strokeDasharray="3" />

              {/* Y Axis Numbers */}
              <text x="30" y="24" className="text-[10px] font-bold fill-slate-400 text-right">100</text>
              <text x="30" y="64" className="text-[10px] font-bold fill-slate-400 text-right">80</text>
              <text x="30" y="104" className="text-[10px] font-bold fill-slate-400 text-right">50</text>
              <text x="30" y="144" className="text-[10px] font-bold fill-slate-400 text-right">30</text>
              <text x="30" y="184" className="text-[10px] font-bold fill-slate-400 text-right">10</text>
              <text x="35" y="214" className="text-[10px] font-bold fill-slate-400 text-right">0</text>

              {/* X Axis Labels */}
              <text x="70" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Sat</text>
              <text x="170" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Sun</text>
              <text x="270" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Mon</text>
              <text x="370" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Tue</text>
              <text x="470" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Wed</text>
              <text x="570" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Thu</text>
              <text x="660" y="235" className="text-[10px] font-extrabold fill-slate-400 text-center">Fri</text>

              {/* Fill Areas first */}
              <path d="M 70 140 C 120 120, 150 180, 170 190 C 220 210, 250 140, 270 130 C 320 110, 350 70, 370 65 C 420 50, 450 70, 470 90 C 520 130, 550 160, 570 150 C 620 130, 640 180, 660 190 L 660 210 L 70 210 Z" fill="url(#gradPresent)" />
              <path d="M 70 130 C 120 110, 150 75, 170 70 C 220 65, 250 110, 270 130 C 320 160, 350 135, 370 130 C 420 120, 450 150, 470 150 C 520 150, 550 100, 570 85 C 620 50, 640 85, 660 110 L 660 210 L 70 210 Z" fill="url(#gradAbsent)" />

              {/* Lines on top */}
              {/* Absent Line (Red) */}
              <path d="M 70 130 C 120 110, 150 75, 170 70 C 220 65, 250 110, 270 130 C 320 160, 350 135, 370 130 C 420 120, 450 150, 470 150 C 520 150, 550 100, 570 85 C 620 50, 640 85, 660 110" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Present Line (Green) */}
              <path d="M 70 140 C 120 120, 150 180, 170 190 C 220 210, 250 140, 270 130 C 320 110, 350 70, 370 65 C 420 50, 450 70, 470 90 C 520 130, 550 160, 570 150 C 620 130, 640 180, 660 190" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

              {/* Hotspots / Intersections */}
              <circle cx="370" cy="65" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="570" cy="85" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Department Donut Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-800 text-sm">Department</h2>
            <div className="relative">
              <select className="bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200/40 outline-none transition cursor-pointer appearance-none">
                <option>All Time</option>
                <option>This Month</option>
              </select>
              <ChevronDown size={12} className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          {/* Donut SVG */}
          <div className="relative flex items-center justify-center h-48 select-none">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Gray Base Circle */}
              <circle cx="80" cy="80" r="55" fill="none" stroke="#f1f5f9" strokeWidth="18" />
              
              {/* Dynamic Segments */}
              {(() => {
                let accumulatedPercent = 0;
                const colors = ['#3b82f6', '#06b6d4', '#eab308', '#a855f7', '#ec4899', '#10b981', '#f97316'];
                return deptStats.map((stat, idx) => {
                  const pct = stat.percentage;
                  const strokeDasharray = `${(345.5 * pct) / 100} ${345.5 - (345.5 * pct) / 100}`;
                  const strokeDashoffset = -((345.5 * accumulatedPercent) / 100);
                  accumulatedPercent += pct;
                  return (
                    <circle
                      key={stat.name}
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke={colors[idx % colors.length]}
                      strokeWidth="18"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 80 80)"
                      strokeLinecap="round"
                    />
                  );
                });
              })()}
            </svg>
            
            {/* Center Text inside Donut */}
            <div className="absolute text-center">
              <span className="block text-2xl font-black text-slate-900 leading-none">{employeeCount}</span>
              <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mt-1 block">Employees</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-3 text-center gap-1 mt-2">
            {(() => {
              const colors = ['#3b82f6', '#06b6d4', '#eab308', '#a855f7', '#ec4899', '#10b981', '#f97316'];
              if (deptStats.length === 0) {
                return (
                  <div className="col-span-3 text-slate-400 text-[10px] font-bold">
                    No department data
                  </div>
                );
              }
              return deptStats.slice(0, 3).map((stat, idx) => (
                <div key={stat.name} className="truncate">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 truncate max-w-full" title={stat.name}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                    {stat.name}
                  </span>
                  <span className="block text-xs font-extrabold text-slate-800 mt-0.5">{stat.percentage}%</span>
                </div>
              ));
            })()}
          </div>
        </div>

      </div>
      {/* Recent Updates Table Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-bold text-slate-800 text-sm">Recent Employee Updates</h2>
          <div className="relative">
            <select className="bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200/40 outline-none transition cursor-pointer appearance-none">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
            <ChevronDown size={12} className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto select-none mt-2">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              {recentUpdates.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-55/40 transition duration-150">
                  
                  {/* Name column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=2563eb&color=fff&bold=true`} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                      />
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  
                  {/* Department */}
                  <td className="py-3.5 px-4">{item.department}</td>
                  
                  {/* Position */}
                  <td className="py-3.5 px-4">{item.position}</td>
                  
                  {/* Date */}
                  <td className="py-3.5 px-4">{item.date}</td>
                  
                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'New Hire' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => navigate('/employees')} 
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition"
                        title="Edit Update"
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => navigate('/employees')}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="Delete Update"
                      >
                        <Trash size={13} />
                      </button>
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
