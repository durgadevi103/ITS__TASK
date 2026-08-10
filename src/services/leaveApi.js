import api from '../api/axios';

/**
 * Leave Management API service integrating with the backend.
 */
export const leaveApi = {
  /**
   * Submit a new leave request.
   * @param {Object} data - Leave details: { emp_id, leave_type, leave_from, leave_to, leave_days, leave_reason }
   */
  createLeaveRequest: async (data) => {
    const response = await api.post('/leave/create', data);
    return response.data;
  },

  /**
   * Get all leave requests.
   */
  getLeaveList: async () => {
    const response = await api.get('/leave/get-list');
    return response.data;
  },

  /**
   * Get paginated leave requests.
   * @param {number} limit
   * @param {number} offset
   */
  getLeaveListPaginated: async (limit, offset) => {
    const response = await api.get(`/leave/viewlist/${limit}/${offset}`);
    return response.data;
  },

  /**
   * Update the status of a leave request (Approve/Reject).
   * @param {number|string} leaveId - ID of the leave request
   * @param {'Approved'|'Rejected'|'Pending'} status - Status to set
   */
  updateLeaveStatus: async (leaveId, status) => {
    const response = await api.put('/leave/status', { id: leaveId, status });
    return response.data;
  },

  /**
   * Get global counts of leave requests (total submissions, approved, pending, rejected).
   */
  getLeaveDashboard: async () => {
    const response = await api.get('/leave/dashboard');
    return response.data;
  },

  /**
   * Get leave balances/allowances for a specific employee.
   * @param {number|string} empId - The employee's ID
   */
  getLeaveAllowance: async (empId) => {
    const response = await api.get(`/leave/leave-allowance/${empId}`);
    return response.data;
  }
};

export default leaveApi;
