import React, { useState, useEffect } from 'react';
import DepartmentList from './DepartmentList';
import AddEditDepartment from './AddEditDepartment';
import ViewDepartment from './ViewDepartment';
import { CheckCircle, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const Department = () => {
  // 1. Core State
  const [departments, setDepartments] = useState([]);

  // 2. View switching state: 'list' | 'add' | 'edit' | 'view'
  const [currentView, setCurrentView] = useState('list');
  const [selectedDept, setSelectedDept] = useState(null);

  // 3. Modals and notices
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 4. Toast Helper
  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Load departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/department/list');
      if (response.data.success) {
        // Sort by backend auto-increment ID ascending to maintain stable order
        const sorted = response.data.list.sort((a, b) => a.id - b.id);
        const mapped = sorted.map((d, index) => ({
          id: `DEP${String(index + 1).padStart(3, '0')}`,
          dept_id_code: d.dept_id_code,
          name: d.name,
          branch: d.branch,
          description: d.description,
          status: d.status,
          createdAt: d.created_at
        }));
        setDepartments(mapped);
      }
    } catch (err) {
      console.error("Error loading departments from backend", err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 5. Action Handlers

  // View Details
  const handleViewDetails = (dept) => {
    setSelectedDept(dept);
    setCurrentView('view');
  };

  // Add Clicked
  const handleAddClick = () => {
    setSelectedDept(null);
    setCurrentView('add');
  };

  // Edit Clicked
  const handleEditClick = (dept) => {
    setSelectedDept(dept);
    setCurrentView('edit');
  };

  // Save New or Modified Department
  const handleSaveDepartment = async (formData) => {
    if (currentView === 'add') {
      const newDept = {
        dept_id_code: formData.dept_id_code.trim(),
        name: formData.name,
        branch: formData.branch,
        description: formData.description,
        status: formData.status,
        created_at: new Date().toISOString().split('T')[0]
      };

      try {
        const response = await api.post('/department/create', newDept);
        if (response.data.success) {
          triggerToast(`Department "${formData.name}" registered successfully!`, 'success');
          fetchDepartments();
        } else {
          triggerToast(`Failed to register department`, 'error');
        }
      } catch (err) {
        console.error(err);
        triggerToast("Failed to connect to backend", "error");
      }
    } else {
      // Editing
      const editPayload = {
        dept_id_code: selectedDept.dept_id_code,
        name: formData.name,
        branch: formData.branch,
        description: formData.description,
        status: formData.status
      };

      try {
        const response = await api.put('/department/edit', editPayload);
        if (response.data.success) {
          triggerToast(`Department "${formData.name}" details updated successfully!`, 'success');
          fetchDepartments();
        } else {
          triggerToast(`Failed to update department`, 'error');
        }
      } catch (err) {
        console.error(err);
        triggerToast("Failed to connect to backend", "error");
      }
    }

    setCurrentView('list');
    setSelectedDept(null);
  };

  // Toggle status (Active / Inactive) - Lock/Unlock Button logic
  const handleToggleStatus = async (id) => {
    const target = departments.find(d => d.id === id);
    if (!target) return;

    const newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await api.put(`/department/toggle-status/${target.dept_id_code}`, { status: newStatus });
      if (response.data.success) {
        triggerToast(`Status for "${target.name}" set to ${newStatus}`, 'info');
        fetchDepartments();
      } else {
        triggerToast(`Failed to toggle status`, 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to connect to backend", "error");
    }
  };


  return (
    <div className="relative h-full flex flex-col">
      {/* Dynamic Animated Toast Message */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-6 z-55 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-semibold ${
              toast.type === 'success' 
                ? 'bg-emerald-950 border-emerald-800 text-emerald-100' 
                : toast.type === 'info'
                ? 'bg-blue-950 border-blue-800 text-blue-100'
                : 'bg-rose-950 border-rose-800 text-rose-100'
            }`}
          >
            <CheckCircle className={`w-5 h-5 ${
              toast.type === 'success' ? 'text-emerald-450' : 'text-blue-400'
            }`} />
            <div className="flex-1 min-w-[180px]">
              <p className="font-extrabold text-white">System Notification</p>
              <p className="text-[10px] text-gray-300 mt-0.5">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="text-gray-400 hover:text-white p-0.5 transition rounded-lg"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Page Switcher with motion animations */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {currentView === 'list' && (
          <DepartmentList 
            departments={departments}
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            onViewClick={handleViewDetails}
            onToggleStatus={handleToggleStatus}
          />
        )}
        
        {currentView === 'view' && selectedDept && (
          <div className="p-4 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col text-gray-700 overflow-hidden">
            <ViewDepartment 
              department={selectedDept}
              onBack={() => {
                setCurrentView('list');
                setSelectedDept(null);
              }}
            />
          </div>
        )}

        {(currentView === 'add' || currentView === 'edit') && (
          <div className="p-4 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col text-gray-700 overflow-hidden">
            <AddEditDepartment 
              department={selectedDept}
              onSave={handleSaveDepartment}
              onCancel={() => {
                setCurrentView('list');
                setSelectedDept(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Department;
