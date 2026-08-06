import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeave } from '../../hooks/useLeave';
import LeaveHeader from './LeaveHeader';
import LeaveTabs from './LeaveTabs';
import LeaveDashboard from './LeaveDashboard';
import LeaveSubmit from './LeaveSubmit';
import LeaveHistory from './LeaveHistory';
import MyRequests from './MyRequests';
import LeavePermission from './LeavePermission';

export const LeaveManagement = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load current logged-in employee on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse current user session', e);
      }
    } else {
      // Fallback fallback employee context if no session is active (for direct links/demos)
      setCurrentUser({
        emp_id: 1,
        employee_id: 1,
        emp_name: 'Durgadevi Balakrishnan',
        fullName: 'Durgadevi Balakrishnan',
        emp_email: 'durga@company.com',
        email: 'durga@company.com',
        emp_dept: 'Engineering',
        emp_designation: 'Senior Frontend Engineer',
        phone: '+91 98765 43210'
      });
    }
  }, []);

  // Initialize Leave Module custom state hook
  const {
    loading,
    error,
    leaveRequests,
    dashboardStats,
    allowance,
    submitLeaveRequest,
    updateLeaveStatus
  } = useLeave(currentUser);

  // Map active tab to view component
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <LeaveDashboard
            stats={dashboardStats}
            allowance={allowance}
            requests={leaveRequests}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'apply':
        return (
          <LeaveSubmit
            currentUser={currentUser}
            allowance={allowance}
            onSubmitRequest={submitLeaveRequest}
            onCancel={() => setActiveTab('dashboard')}
            leaveRequests={leaveRequests}
            stats={dashboardStats}
          />
        );
      case 'history':
        return (
          <LeaveHistory
            requests={leaveRequests}
            onUpdateStatus={updateLeaveStatus}
            loading={loading}
          />
        );
      case 'requests':
        return (
          <MyRequests
            requests={leaveRequests}
            currentUser={currentUser}
            loading={loading}
          />
        );
      case 'permission':
        return (
          <LeavePermission
            currentUser={currentUser}
          />
        );
      default:
        return (
          <div className="text-center py-20 font-semibold text-slate-400">
            View under construction.
          </div>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50">
      {/* 1. Page Header */}
      <LeaveHeader 
        title="Leave & Time-Off Management" 
        subtitle="Apply for leave, track vacation allowance, and request hourly checkout permissions." 
        activeTab={activeTab} 
      />

      {/* 2. Page Navigation Tabs */}
      <LeaveTabs 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* 3. Render Active Tab View with Fade Animation */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaveManagement;
