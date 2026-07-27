import React from 'react';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  Pencil, 
  Lock, 
  Unlock, 
  Trash2, 
  ArrowLeft 
} from 'lucide-react';

/**
 * Reusable base Button component using React.createElement to support pure JS builds
 */
export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon = null,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg outline-none active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-5 py-2.5 text-sm'
  };

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 border border-transparent',
    success: 'bg-[#00b074] hover:bg-[#009b66] text-white shadow-md shadow-emerald-600/10 border border-transparent',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10 border border-transparent',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 border border-transparent'
  };

  return React.createElement(
    'button',
    {
      type,
      onClick,
      disabled,
      className: `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`,
      ...props
    },
    Icon && React.createElement(Icon, { size: size === 'sm' ? 14 : size === 'lg' ? 18 : 16 }),
    children
  );
};

/**
 * '+ Add Department' green button
 */
export const AddDepartmentBtn = ({ onClick, ...props }) => {
  return React.createElement(
    Button,
    {
      variant: 'primary',
      onClick,
      icon: Plus,
      className: 'py-1.5 px-3.5 tracking-wide text-xs',
      ...props
    },
    'Add Department'
  );
};

/**
 * 'Search' green button with magnifying glass
 */
export const SearchBtn = ({ onClick, ...props }) => {
  return React.createElement(
    Button,
    {
      variant: 'primary',
      onClick,
      icon: Search,
      className: 'py-1.5 px-3.5 tracking-wide text-xs',
      ...props
    },
    'Search'
  );
};

/**
 * 'Filters' button
 */
export const FilterBtn = ({ onClick, ...props }) => {
  return React.createElement(
    Button,
    {
      variant: 'secondary',
      onClick,
      icon: SlidersHorizontal,
      className: 'py-1.5 px-3 text-xs font-semibold text-gray-600',
      ...props
    },
    'Filters'
  );
};

/**
 * Action Buttons for the table rows
 * - view: Eye icon
 * - edit: Pencil icon
 * - lock: Padlock icon (represents lock/status toggle)
 * - delete: Trash icon
 */
export const ActionBtn = ({ type, onClick, active = true, className = '', ...props }) => {
  const baseStyle = 'p-1.5 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs';
  
  const configs = {
    view: {
      color: 'text-sky-500 border-sky-100 bg-sky-50/30 hover:bg-sky-50 hover:border-sky-200',
      icon: Eye,
      title: 'View Details'
    },
    edit: {
      color: 'text-amber-500 border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-200',
      icon: Pencil,
      title: 'Edit Department'
    },
    lock: {
      color: active 
        ? 'text-orange-500 border-orange-100 bg-orange-50/30 hover:bg-orange-50 hover:border-orange-200'
        : 'text-gray-400 border-gray-100 bg-gray-50/30 hover:bg-gray-100 hover:border-gray-200',
      icon: active ? Lock : Unlock,
      title: active ? 'Deactivate Department' : 'Activate Department'
    },
    delete: {
      color: 'text-rose-500 border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:border-rose-200',
      icon: Trash2,
      title: 'Delete Department'
    }
  };

  const config = configs[type];
  if (!config) return null;

  const Icon = config.icon;

  return React.createElement(
    'button',
    {
      type: 'button',
      onClick,
      className: `${baseStyle} ${config.color} ${className}`,
      title: config.title,
      ...props
    },
    React.createElement(Icon, { size: 14, className: 'stroke-[2.2]' })
  );
};

/**
 * Simple 'Back' button
 */
export const BackButton = ({ onClick, ...props }) => {
  return React.createElement(
    Button,
    {
      variant: 'secondary',
      onClick,
      icon: ArrowLeft,
      className: 'py-1.5 px-3 text-xs',
      ...props
    },
    'Back'
  );
};
