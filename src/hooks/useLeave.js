import { useState, useCallback, useEffect } from 'react';
import leaveApi from '../services/leaveApi';
import api from '../api/axios';

export const useLeave = (currentUser = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data lists
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_submissions: 0,
    approved_leaves: 0,
    pending_leaves: 0,
    rejected_leaves: 0
  });

  // Current employee's leave balances
  const [allowance, setAllowance] = useState([
    { type: 'Casual Leave (CL)', key: 'CL', total: 12, used: 0, remaining: 12, gradient: 'from-blue-500 to-indigo-600', color: 'text-blue-600' },
    { type: 'Sick Leave (SL)', key: 'SL', total: 12, used: 0, remaining: 12, gradient: 'from-teal-400 to-emerald-600', color: 'text-teal-600' },
    { type: 'Privilege Leave (PL)', key: 'PL', total: 20, used: 0, remaining: 20, gradient: 'from-amber-400 to-orange-600', color: 'text-amber-600' },
    { type: 'Maternity Leave (ML)', key: 'ML', total: 90, used: 0, remaining: 90, gradient: 'from-pink-400 to-rose-600', color: 'text-pink-600' }
  ]);

  // Load employees and departments (cached/pre-fetched for reference lists)
  const fetchBaseData = useCallback(async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('/employee/list/1000/0').catch(() => ({ data: { success: false } })),
        api.get('/department/list/1000/0').catch(() => ({ data: { success: false } }))
      ]);

      if (empRes.data?.success && empRes.data?.list) {
        setEmployees(empRes.data.list);
      }
      
      const deptData = deptRes.data?.data || deptRes.data?.list;
      if (deptRes.data?.success && deptData) {
        setDepartments(deptData);
      }
    } catch (err) {
      console.error('Failed to load employee/department context', err);
    }
  }, []);

  // Fetch allowance for specific employee
  const fetchAllowance = useCallback(async (empId) => {
    if (!empId) return;
    try {
      setLoading(true);
      const res = await leaveApi.getLeaveAllowance(empId);
      if (res?.success && Array.isArray(res.data)) {
        // Map backend response (rows group by leave_type)
        const updatedAllowance = allowance.map(item => {
          const matched = res.data.find(row => 
            row.leave_type === item.type || 
            row.leave_type === item.key ||
            row.leave_type?.startsWith(item.type.split(' ')[0])
          );
          
          if (matched) {
            const used = Number(matched.used_days) || 0;
            const total = Number(matched.total_days) || item.total;
            return {
              ...item,
              total,
              used,
              remaining: total - used
            };
          }
          return item;
        });
        setAllowance(updatedAllowance);
      }
    } catch (err) {
      console.error('Failed to load leave balance allowance', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch leave dashboard metrics
  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await leaveApi.getLeaveDashboard();
      if (res?.success && res.data) {
        setDashboardStats({
          total_submissions: Number(res.data.total_submissions) || 0,
          approved_leaves: Number(res.data.approved_leaves) || 0,
          pending_leaves: Number(res.data.pending_leaves) || 0,
          rejected_leaves: Number(res.data.rejected_leaves) || 0
        });
      }
    } catch (err) {
      console.error('Failed to load leave dashboard statistics', err);
    }
  }, []);

  // Fetch list of requests
  const fetchLeaveRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leaveApi.getLeaveList();
      if (res?.success && res.data) {
        setLeaveRequests(res.data);
      }
    } catch (err) {
      setError('Failed to fetch leave requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit leave request
  const submitLeaveRequest = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const res = await leaveApi.createLeaveRequest(payload);
      if (res?.success) {
        await Promise.all([
          fetchLeaveRequests(),
          fetchDashboardStats(),
          fetchAllowance(payload.emp_id)
        ]);
        return { success: true };
      }
      return { success: false, error: 'Submission failed on server' };
    } catch (err) {
      console.error(err);
      setError('Error submitting leave request');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchLeaveRequests, fetchDashboardStats, fetchAllowance]);

  // Update leave request status
  const updateLeaveStatus = useCallback(async (leaveId, status) => {
    try {
      setLoading(true);
      const res = await leaveApi.updateLeaveStatus(leaveId, status);
      if (res?.success) {
        await Promise.all([
          fetchLeaveRequests(),
          fetchDashboardStats()
        ]);
        
        // Reload allowance for affected employee if possible
        const req = leaveRequests.find(r => r.leave_id === leaveId);
        if (req && req.emp_id) {
          await fetchAllowance(req.emp_id);
        }
        return { success: true };
      }
      return { success: false, error: 'Status update failed' };
    } catch (err) {
      console.error(err);
      setError('Error updating leave status');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [leaveRequests, fetchLeaveRequests, fetchDashboardStats, fetchAllowance]);

  // Initial load
  useEffect(() => {
    fetchBaseData();
    fetchLeaveRequests();
    fetchDashboardStats();
  }, [fetchBaseData, fetchLeaveRequests, fetchDashboardStats]);

  // Sync allowance when currentUser changes
  useEffect(() => {
    if (currentUser?.emp_id || currentUser?.employee_id) {
      fetchAllowance(currentUser.emp_id || currentUser.employee_id);
    }
  }, [currentUser, fetchAllowance]);

  return {
    loading,
    error,
    employees,
    departments,
    leaveRequests,
    dashboardStats,
    allowance,
    fetchAllowance,
    fetchLeaveRequests,
    fetchDashboardStats,
    submitLeaveRequest,
    updateLeaveStatus
  };
};

export default useLeave;
