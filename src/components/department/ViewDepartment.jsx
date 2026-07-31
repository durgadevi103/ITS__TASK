import React, { useState, useEffect } from 'react';
import { BackButton } from '../button';
import {
  Building2,
  Hash,
  CheckCircle,
  XCircle,
  Users,
  Mail,
  Phone,
  User
} from 'lucide-react';
import api from '../../api/axios';

const ViewDepartment = ({ department, onBack }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employee/list');
        if (response.data.success && response.data.list) {
          const mapped = response.data.list.map(emp => ({
            id: `EMP${String(emp.employee_id).padStart(3, '0')}`,
            employee_id: emp.employee_id,
            name: emp.emp_name,
            email: emp.emp_email,
            dob: emp.emp_dob,
            gender: emp.emp_gender,
            phone: emp.emp_ph_no,
            address: emp.emp_address,
            emergencyContact: emp.emp_emg_contact,
            emergencyPhone: emp.emp_emg_phone,
            bloodGroup: emp.emp_bld_grp,
            maritalStatus: emp.emp_merit,
            nationality: emp.emp_nationality,
            languages: emp.emp_language,
            department: emp.emp_dept,
            designation: emp.emp_designation || emp.emp_desigation,
            salary: emp.emp_salary || '',
            status: 'Active',
            avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.emp_name)}&background=2563eb&color=fff&bold=true`
          }));

          const filtered = mapped.filter(emp => {
            if (!emp.department || !department.name) return false;
            const ed = emp.department.toLowerCase().trim();
            const dn = department.name.toLowerCase().trim();
            if (ed === dn) return true;
            if (ed === 'it' && dn.includes('information technology')) return true;
            if (ed === 'hr' && dn.includes('human resources')) return true;
            if (ed === 'finance' && dn.includes('finance')) return true;
            if (ed === 'marketing' && dn.includes('marketing')) return true;
            if (ed === 'operations' && dn.includes('operations')) return true;
            return dn.includes(ed) || ed.includes(dn);
          });
          setEmployees(filtered);
        }
      } catch (err) {
        console.error("Error reading employees in ViewDepartment", err);
      }
    };
    fetchEmployees();
  }, [department]);

  const isActive = department.status === 'Active';

  return (
    <div className="flex-1 w-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BackButton onClick={onBack} className="!bg-white/10 hover:!bg-white/20 !text-white !border-transparent hover:!border-transparent" />
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Department Details
            </h2>
            <p className="text-[10px] text-blue-100 mt-0.5">Viewing profile for {department.name}</p>
          </div>
        </div>
      </div>

      {/* Main Details and Employee List */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 text-xs text-gray-600">

        {/* Detail Panel */}
        <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Department Name</span>
              <h3 className="text-base font-extrabold text-gray-900 mt-0.5">{department.name}</h3>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Department Code</span>
              <div className="flex items-center gap-1.5 text-indigo-650 font-bold mt-1 text-xs">
                <Hash size={13} className="text-indigo-500" />
                {department.dept_id_code}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                  {isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  {department.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Description</span>
            <p className="text-gray-600 leading-relaxed font-medium mt-1">
              {department.description || "No description provided for this department."}
            </p>
          </div>
        </div>

        {/* Associated Employees Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Staff Members ({employees.length})
            </h3>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
              Assigned Personnel
            </span>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-500">No employees assigned to this department yet.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Go to the Employees page to register staff under this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {employees.map(emp => (
                <div key={emp.id} className="flex items-center justify-between p-3 border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-xs rounded-xl transition duration-150">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=eef2ff&color=4f46e5&bold=true`}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{emp.name}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">{emp.id} • {emp.designation}</p>

                      <div className="flex flex-col gap-0.5 mt-1 text-[9px] text-gray-500">
                        {emp.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={10} className="text-gray-400" />
                            {emp.email}
                          </span>
                        )}
                        {emp.phone && emp.phone !== "Not Provided" && (
                          <span className="flex items-center gap-1">
                            <Phone size={10} className="text-gray-400" />
                            {emp.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${emp.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : emp.status === 'On Leave'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'bg-gray-50 text-gray-500 border border-gray-100'
                    }`}>
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewDepartment;
