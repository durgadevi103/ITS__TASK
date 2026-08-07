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
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

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
      const isSearchActive = searchQuery.trim() !== '' || filterStatus !== 'All';
      let listData = [];
      let totalCount = 0;

      if (isSearchActive) {
        const payload = {
          search: searchQuery,
          dept_status: filterStatus === 'All' ? 'ALL' : (filterStatus === 'Active' ? '1' : '0'),
          limit: perPage,
          offset: (currentPage - 1) * perPage
        };
        const response = await api.post('/department/search', payload);
        if (response.data.success && response.data.result) {
          listData = response.data.result || [];
          totalCount = listData[0]?.total || 0;
        }
      } else {
        const limit = perPage;
        const offset = (currentPage - 1) * perPage;
        const response = await api.get(`/department/list/${limit}/${offset}`);
        const data = response.data.data || response.data.list;
        if (response.data.success && data) {
          listData = data || [];
          totalCount = response.data.count || listData.length;
        }
      }

      // Sort by backend auto-increment ID ascending
      const sorted = listData.sort((a, b) => (a.dept_id || a.id) - (b.dept_id || b.id));
      const mapped = sorted.map((d, index) => ({
        dept_id: d.dept_id,
        id: d.dept_id ? `DEP${String(d.dept_id).padStart(3, '0')}` : (typeof d.id === 'string' && d.id.startsWith('DEP') ? d.id : `DEP${String(d.id || index + 1).padStart(3, '0')}`),
        dept_id_code: d.dept_code || d.dept_id_code || `DEP${index + 1}`,
        name: d.dept_name || d.name,
        branch: d.branch || "Chennai",
        description: d.dept_desc || d.description,
        status: (d.dept_status === 0 || d.dept_status === '0' || d.dept_status === 'Inactive') ? 'Inactive' : 'Active',
        createdAt: d.created_at || new Date().toISOString().split('T')[0]
      }));
      setDepartments(mapped);
      setTotalDepartments(totalCount);
    } catch (err) {
      console.error("Error loading departments from backend", err);
      setDepartments([]);
      setTotalDepartments(0);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, perPage, searchQuery, filterStatus]);

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
        dept_name: formData.name,
        dept_code: formData.dept_id_code.trim(),
        dept_desc: formData.description,
        dept_status: formData.status === 'Active' ? 1 : 0,
        name: formData.name,
        branch: formData.branch,
        description: formData.description,
        status: formData.status
      };

      try {
        const response = await api.post('/department/create', newDept);
        if (response.data.success) {
          triggerToast(`Department "${formData.name}" registered successfully!`, 'success');
          fetchDepartments();
          setCurrentView('list');
          setSelectedDept(null);
        } else {
          triggerToast("Failed to register department in database.", 'error');
        }
      } catch (err) {
        console.error(err);
        triggerToast("Error contacting backend server.", 'error');
      }

    } else {
      // Editing
      const editPayload = {
        dept_id: selectedDept.dept_id,
        dept_code: formData.dept_id_code,
        dept_name: formData.name,
        dept_desc: formData.description,
        dept_status: formData.status === 'Active' ? 1 : 0
      };

      try {
        const response = await api.put('/department/edit', editPayload);
        if (response.data.success) {
          triggerToast(`Department "${formData.name}" details updated successfully!`, 'success');
          fetchDepartments();
          setCurrentView('list');
          setSelectedDept(null);
        } else {
          triggerToast("Failed to update department in database.", 'error');
        }
      } catch (err) {
        console.error(err);
        triggerToast("Error contacting backend server.", 'error');
      }
    }
  };

  // Toggle status (Active / Inactive) - Lock/Unlock Button logic
  const handleToggleStatus = async (id) => {
    const target = departments.find(d => d.id === id);
    if (!target) return;

    const newStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    const editPayload = {
      dept_id: target.dept_id,
      dept_code: target.dept_id_code,
      dept_name: target.name,
      dept_desc: target.description,
      dept_status: newStatus === 'Active' ? 1 : 0
    };

    try {
      const response = await api.put('/department/edit', editPayload);
      if (response.data.success) {
        triggerToast(`Status for "${target.name}" set to ${newStatus}`, 'info');
        fetchDepartments();
      } else {
        triggerToast("Failed to update status in database.", 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error contacting backend server.", 'error');
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
            className={`fixed top-20 right-6 z-55 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-semibold ${toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-800 text-emerald-100'
                : toast.type === 'info'
                  ? 'bg-blue-950 border-blue-800 text-blue-100'
                  : 'bg-rose-950 border-rose-800 text-rose-100'
              }`}
          >
            <CheckCircle className={`w-5 h-5 ${toast.type === 'success' ? 'text-emerald-450' : 'text-blue-400'
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
            totalDepartments={totalDepartments}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            perPage={perPage}
            setPerPage={setPerPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            onViewClick={handleViewDetails}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {currentView === 'view' && selectedDept && (
          <div className="p-0 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col text-gray-700 overflow-hidden">
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
          <div className="p-0 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col text-gray-700 overflow-hidden">
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
