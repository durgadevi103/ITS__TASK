import React from 'react'
import { Search, Filter } from 'lucide-react'

const Searchbar = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  statusValue,
  onStatusChange,
  statusOptions = [],
  filterValue,
  onFilterChange,
  filterOptions = [],
  children,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {statusOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusValue}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterOptions.length > 0 && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {children}
      </div>
    </div>
  )
}

export default Searchbar
