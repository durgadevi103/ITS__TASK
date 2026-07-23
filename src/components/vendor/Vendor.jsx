import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Mail,
  Phone,
  DollarSign,
  Truck,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
  TrendingUp,
  X,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Buttoncomponent from '../resusedComponent/Buttoncomponent';
import Cards from '../cards/Cards';
import Searchbar from '../resusedComponent/Searchbar';

const Vendor = () => {
  // Initial Mock Vendor Data
  const [vendors, setVendors] = useState([
    {
      id: "VND-501",
      name: "Global Tech Supplies",
      contactPerson: "Robert Chen",
      category: "Electronics",
      email: "r.chen@globaltech.com",
      phone: "+1 (555) 321-7654",
      rating: 4.9,
      activeOrders: 8,
      totalPayout: 64200.00,
      status: "Active",
      contractDate: "Jan 2023",
      badgeColor: "bg-indigo-500"
    },
    {
      id: "VND-502",
      name: "Nexus Components Solutions",
      contactPerson: "Sarah Jenkins",
      category: "Hardware",
      email: "s.jenkins@nexuscomp.com",
      phone: "+1 (555) 789-0123",
      rating: 4.7,
      activeOrders: 3,
      totalPayout: 28500.50,
      status: "Active",
      contractDate: "May 2023",
      badgeColor: "bg-cyan-500"
    },
    {
      id: "VND-503",
      name: "Apex Packaging & Co",
      contactPerson: "Michael Scott",
      category: "Packaging",
      email: "m.scott@apexpack.com",
      phone: "+1 (555) 456-1234",
      rating: 4.5,
      activeOrders: 12,
      totalPayout: 14800.00,
      status: "Active",
      contractDate: "Aug 2023",
      badgeColor: "bg-emerald-500"
    },
    {
      id: "VND-504",
      name: "Velocity Freight Express",
      contactPerson: "Amanda Martinez",
      category: "Logistics",
      email: "amanda@velocityexpress.com",
      phone: "+1 (555) 987-1234",
      rating: 4.8,
      activeOrders: 5,
      totalPayout: 39100.00,
      status: "Active",
      contractDate: "Feb 2024",
      badgeColor: "bg-purple-500"
    },
    {
      id: "VND-505",
      name: "Orion Industrial Furniture",
      contactPerson: "Daniel Craig",
      category: "Furniture",
      email: "d.craig@orionfurniture.com",
      phone: "+1 (555) 654-9870",
      rating: 4.2,
      activeOrders: 0,
      totalPayout: 9800.00,
      status: "Pending Review",
      contractDate: "Jun 2024",
      badgeColor: "bg-amber-500"
    },
    {
      id: "VND-506",
      name: "Zenith Office Automation",
      contactPerson: "Lisa Wong",
      category: "Office Supplies",
      email: "lisa@zenithauto.com",
      phone: "+1 (555) 234-8901",
      rating: 4.1,
      activeOrders: 0,
      totalPayout: 4500.00,
      status: "Inactive",
      contractDate: "Nov 2022",
      badgeColor: "bg-rose-500"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Success Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // New Vendor Form State
  const [newVendor, setNewVendor] = useState({
    name: "",
    contactPerson: "",
    category: "Electronics",
    email: "",
    phone: "",
    status: "Active"
  });

  // Calculate Metrics
  const totalCount = vendors.length;
  const activeCount = vendors.filter(v => v.status === "Active").length;
  const activeOrdersCount = vendors.reduce((acc, v) => acc + v.activeOrders, 0);
  const totalPayoutSum = vendors.reduce((acc, v) => acc + v.totalPayout, 0);

  // Filter Logic
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || v.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Add Vendor Handler
  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.email) return;

    const colors = ["bg-indigo-500", "bg-cyan-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
    const created = {
      id: `VND-${500 + vendors.length + 1}`,
      name: newVendor.name,
      contactPerson: newVendor.contactPerson || "Primary Contact",
      category: newVendor.category,
      email: newVendor.email,
      phone: newVendor.phone || "+1 (555) 000-0000",
      rating: 4.5,
      activeOrders: 1,
      totalPayout: 0.00,
      status: newVendor.status,
      contractDate: "Just Now",
      badgeColor: colors[Math.floor(Math.random() * colors.length)]
    };

    setVendors([created, ...vendors]);
    setNewVendor({ name: "", contactPerson: "", category: "Electronics", email: "", phone: "", status: "Active" });
    setIsModalOpen(false);

    // Trigger Toast Notification
    setToastMsg("Vendor added");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Delete Vendor Handler
  const handleDeleteVendor = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen relative">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{toastMsg}</p>
                <p className="text-xs text-emerald-100">Supplier contract registered successfully.</p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-cyan-600" />
            <span>Vendor Management Dashboard</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Oversee supplier contracts, purchase orders, performance ratings, and procurement volume.
          </p>
        </div>

        <Buttoncomponent
          onClick={() => setIsModalOpen(true)}
          variant="Add New Vendor"
          icon={Plus}
        />
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Cards
          title="Total Suppliers"
          value={totalCount}
          trendText="Verified Partners"
          trendIcon={ShieldCheck}
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <Cards
          title="Active Contracts"
          value={activeCount}
          trendText="Operational"
          trendIcon={CheckCircle}
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <Cards
          title="Active POs"
          value={activeOrdersCount}
          trendText="In Transit / Processing"
          trendIcon={Truck}
          icon={PackageCheck}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          valueColor="text-purple-600"
          trendColor="text-purple-600"
        />

        <Cards
          title="Total Procurement Spent"
          value={`$${totalPayoutSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trendText="Cumulative Payouts"
          trendIcon={DollarSign}
          icon={DollarSign}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
          trendColor="text-cyan-600"
        />
      </div>

      <Searchbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by vendor name, contact person, or supply category..."
        statusValue={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusOptions={[
          { value: "All", label: "All Statuses" },
          { value: "Active", label: "Active" },
          { value: "Pending Review", label: "Pending Review" },
          { value: "Inactive", label: "Inactive" }
        ]}
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={[
          { value: "All", label: "All Categories" },
          { value: "Electronics", label: "Electronics" },
          { value: "Hardware", label: "Hardware" },
          { value: "Packaging", label: "Packaging" },
          { value: "Logistics", label: "Logistics" },
          { value: "Furniture", label: "Furniture" },
          { value: "Office Supplies", label: "Office Supplies" }
        ]}
      />

      {/* Vendor Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredVendors.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No vendors found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or filter selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Vendor / Company</th>
                  <th className="py-4 px-6">Contact Person</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Active POs</th>
                  <th className="py-4 px-6">Total Payout</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${v.badgeColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{v.name}</p>
                          <span className="text-xs text-gray-400 font-mono">{v.id} • Contracted {v.contractDate}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800">{v.contactPerson}</p>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {v.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {v.category}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{v.rating}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-gray-900">{v.activeOrders} Orders</td>

                    <td className="py-4 px-6 font-bold text-gray-900">${v.totalPayout.toFixed(2)}</td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                          v.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : v.status === "Pending Review"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            v.status === "Active"
                              ? "bg-emerald-500"
                              : v.status === "Pending Review"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        {v.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedVendor(v)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-cyan-600 transition"
                          title="View Vendor Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(v.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" />
                Add New Vendor
              </h3>
              <p className="text-xs text-gray-500 mb-5">Register a new supplier to your procurement network.</p>

              <form onSubmit={handleAddVendor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    placeholder="e.g. Acme Microelectronics Inc."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newVendor.contactPerson}
                    onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                    placeholder="e.g. John Doe (Account Manager)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                      placeholder="contact@company.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Supply Category</label>
                    <select
                      value={newVendor.category}
                      onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Office Supplies">Office Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Contract Status</label>
                    <select
                      value={newVendor.status}
                      onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-md transition text-sm"
                  >
                    Save Vendor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vendor Preview Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 text-center"
            >
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-16 h-16 rounded-2xl ${selectedVendor.badgeColor} text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg`}>
                {selectedVendor.name.charAt(0)}
              </div>

              <h3 className="text-xl font-bold text-gray-900">{selectedVendor.name}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedVendor.id}</p>

              <div className="mt-5 p-4 bg-gray-50 rounded-2xl space-y-2.5 text-left text-xs">
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Contact Person:</span>
                  <span className="font-semibold text-gray-800">{selectedVendor.contactPerson}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-semibold text-gray-800">{selectedVendor.category}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-semibold text-gray-800">{selectedVendor.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Performance Rating:</span>
                  <span className="font-semibold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedVendor.rating}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500">Total Payouts:</span>
                  <span className="font-bold text-gray-900">${selectedVendor.totalPayout.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedVendor(null)}
                className="mt-6 w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
              >
                Close Vendor Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vendor;