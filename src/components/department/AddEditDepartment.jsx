import React, { useState, useEffect } from 'react';
import { Button, BackButton } from '../button';
import { 
  Building2, 
  Hash, 
  AlignLeft, 
  Activity, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AddEditDepartment = ({ department, onSave, onCancel }) => {
  const isEdit = !!department;
  
  const [form, setForm] = useState({
    dept_id_code: '',
    name: '',
    branch: 'Corporate Center',
    description: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && department) {
      setForm({
        dept_id_code: department.dept_id_code || '',
        name: department.name || '',
        branch: department.branch || 'Corporate Center',
        description: department.description || '',
        status: department.status || 'Active'
      });
    } else {
      setForm({
        dept_id_code: '',
        name: '',
        branch: 'Corporate Center',
        description: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [department, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    if (!form.dept_id_code.trim()) {
      newErrors.dept_id_code = 'Department code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalDescription = form.description.trim() 
      ? form.description.trim() 
      : `Handles the overall planning, execution, coordination, and operations relating to ${form.name}.`;

    const departmentData = {
      ...form,
      description: finalDescription,
      name: form.name.trim()
    };

    onSave(departmentData);
  };



  return (
    <div className="flex-1 w-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BackButton onClick={onCancel} className="!bg-white/10 hover:!bg-white/20 !text-white !border-transparent hover:!border-transparent" />
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {isEdit ? 'Modify Department Details' : 'Register New Department'}
            </h2>
            <p className="text-[10px] text-blue-100 mt-0.5">
              {isEdit 
                ? `Update attributes for department code: ${department.dept_id_code}`
                : 'Fill out department name and status details.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Scrollable Fields Section */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 text-xs text-gray-600">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 border-b border-gray-150 pb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-500" />
              Department Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Department Name */}
              <div className="space-y-1">
                <label className="block font-semibold text-gray-750">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Quality Assurance, Public Relations"
                    className={`w-full px-3 py-2 bg-gray-50/50 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition ${
                      errors.name ? 'border-rose-450 focus:ring-rose-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={11} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Department Code */}
              <div className="space-y-1">
                <label className="block font-semibold text-gray-700">
                  Department Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="dept_id_code"
                    value={form.dept_id_code}
                    onChange={handleChange}
                    disabled={isEdit}
                    placeholder="e.g. DEP001, IT_DEPT"
                    className={`w-full px-3 py-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-bold ${
                      isEdit 
                        ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed font-bold' 
                        : errors.dept_id_code 
                        ? 'bg-gray-50/50 border-rose-450 focus:ring-rose-500' 
                        : 'bg-gray-50/50 border-gray-200 focus:bg-white'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <Hash size={14} />
                  </div>
                </div>
                {errors.dept_id_code && (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle size={11} />
                    {errors.dept_id_code}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block font-semibold text-gray-750">
                  Current Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition cursor-pointer appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <Activity size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block font-semibold text-gray-750">
                Functional Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Summarize the core roles, workflows, financial planning, or technical scope under this department..."
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition resize-none"
                />
                <div className="absolute top-2.5 right-3 text-gray-400">
                  <AlignLeft size={14} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                If left empty, a generic descriptive overview will be auto-generated based on the name.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-2 border-t border-gray-150 shrink-0">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-5 shadow-blue-500/10"
          >
            {isEdit ? 'Save Changes' : 'Register Department'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditDepartment;
