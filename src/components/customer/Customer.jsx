import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Crown,
  TrendingUp,
  X,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Buttoncomponent from '../resusedComponent/Buttoncomponent';
import Cards from '../cards/Cards';

const Customer = () => {
  // Initial Mock Customer Data
  const [customers, setCustomers] = useState([
    {
      id: "CUST-801",
      name: "Sophia Rose",
      email: "sophia.rose@example.com",
      phone: "+1 (555) 234-5678",
      tier: "VIP",
      orders: 28,
      totalSpent: 4250.00,
      status: "Active",
      joinDate: "Jan 12, 2024",
      avatarColor: "bg-indigo-500"
    },
    {
      id: "CUST-802",
      name: "Marcus Vance",
      email: "marcus.vance@example.com",
      phone: "+1 (555) 876-5432",
      tier: "Regular",
      orders: 14,
      totalSpent: 1820.50,
      status: "Active",
      joinDate: "Mar 05, 2024",
      avatarColor: "bg-cyan-500"
    },
    {
      id: "CUST-803",
      name: "Elena Rostova",
      email: "elena.r@example.com",
      phone: "+1 (555) 345-6789",
      tier: "VIP",
      orders: 42,
      totalSpent: 8900.00,
      status: "Active",
      joinDate: "Nov 20, 2023",
      avatarColor: "bg-purple-500"
    },
    {
      id: "CUST-804",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 987-6543",
      tier: "New",
      orders: 2,
      totalSpent: 145.00,
      status: "Pending",
      joinDate: "Jul 10, 2024",
      avatarColor: "bg-emerald-500"
    },
    {
      id: "CUST-805",
      name: "Jessica Miller",
      email: "j.miller@example.com",
      phone: "+1 (555) 456-7890",
      tier: "Regular",
      orders: 9,
      totalSpent: 980.00,
      status: "Inactive",
      joinDate: "Feb 18, 2024",
      avatarColor: "bg-rose-500"
    },
    {
      id: "CUST-806",
      name: "Alex Turner",
      email: "alex.t@example.com",
      phone: "+1 (555) 654-3210",
      tier: "Regular",
      orders: 19,
      totalSpent: 2640.75,
      status: "Active",
      joinDate: "Apr 22, 2024",
      avatarColor: "bg-amber-500"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Success Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    tier: "Regular",
    status: "Active"
  });

  // Calculate Metrics
  const totalCount = customers.length;
  const activeCount = customers.filter(c => c.status === "Active").length;
  const vipCount = customers.filter(c => c.tier === "VIP").length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "All" || c.status === selectedStatus;
    const matchesTier = selectedTier === "All" || c.tier === selectedTier;
    return matchesSearch && matchesStatus && matchesTier;
  });

  // Add Customer Submit Handler
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;

    const colors = ["bg-indigo-500", "bg-cyan-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];
    const created = {
      id: `CUST-${800 + customers.length + 1}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || "+1 (555) 000-0000",
      tier: newCustomer.tier,
      orders: 0,
      totalSpent: 0.00,
      status: newCustomer.status,
      joinDate: "Today",
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };

    setCustomers([created, ...customers]);
    setNewCustomer({ name: "", email: "", phone: "", tier: "Regular", status: "Active" });
    setIsModalOpen(false);

    // Trigger Success Toast
    setToastMsg("Customer added");
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Delete Customer Handler
  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen relative">
      {/* Toast Notification */}
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
                <p className="text-xs text-emerald-100">Customer account created successfully.</p>
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
            <Users className="w-8 h-8 text-cyan-600" />
            <span>Customer Dashboard</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your client accounts, purchase volume, and customer relationship metrics.
          </p>
        </div>

        <Buttoncomponent
          onClick={() => setIsModalOpen(true)}
          variant="Add New Customer"
          icon={UserPlus}
        />
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Cards
          title="Total Customers"
          value={totalCount}
          trendText="+12% this month"
          trendIcon={TrendingUp}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <Cards
          title="Active Accounts"
          value={activeCount}
          trendText="High Engagement"
          trendIcon={UserCheck}
          icon={UserCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <Cards
          title="VIP Members"
          value={vipCount}
          trendText="Premium Tiers"
          trendIcon={Crown}
          icon={Crown}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          valueColor="text-purple-600"
          trendColor="text-purple-600"
        />

        <Cards
          title="Lifetime Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trendText="Cumulative Sales"
          trendIcon={DollarSign}
          icon={DollarSign}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
          trendColor="text-cyan-600"
        />
      </div>

      {/* Control Bar Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          >
            <option value="All">All Tiers</option>
            <option value="VIP">VIP Tier</option>
            <option value="Regular">Regular Tier</option>
            <option value="New">New Tier</option>
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No customers found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Tier</th>
                  <th className="py-4 px-6">Orders</th>
                  <th className="py-4 px-6">Total Spent</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{c.name}</p>
                          <span className="text-xs text-gray-400 font-mono">{c.id} • Joined {c.joinDate}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                          c.tier === "VIP"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : c.tier === "New"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {c.tier === "VIP" && <Crown className="w-3.5 h-3.5 text-purple-600" />}
                        {c.tier}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-semibold text-gray-900">{c.orders} orders</td>

                    <td className="py-4 px-6 font-bold text-gray-900">${c.totalSpent.toFixed(2)}</td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : c.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === "Active"
                              ? "bg-emerald-500"
                              : c.status === "Pending"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-cyan-600 transition"
                          title="View Customer Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition"
                          title="Delete Customer"
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

      {/* Add Customer Modal */}
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
                <UserPlus className="w-5 h-5 text-cyan-600" />
                Add New Customer
              </h3>
              <p className="text-xs text-gray-500 mb-5">Create a new customer profile in your workspace database.</p>

              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="e.g. Samantha Wright"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="samantha@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Tier</label>
                    <select
                      value={newCustomer.tier}
                      onChange={(e) => setNewCustomer({ ...newCustomer, tier: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    >
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                      <option value="New">New</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={newCustomer.status}
                      onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
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
                    Save Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Details Preview Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 text-center"
            >
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-16 h-16 rounded-2xl ${selectedCustomer.avatarColor} text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg`}>
                {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
              </div>

              <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedCustomer.id}</p>

              <div className="mt-5 p-4 bg-gray-50 rounded-2xl space-y-2.5 text-left text-xs">
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomer.phone}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Tier Segment:</span>
                  <span className="font-semibold text-purple-700">{selectedCustomer.tier}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Completed Orders:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomer.orders}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500">Total Spent:</span>
                  <span className="font-bold text-gray-900">${selectedCustomer.totalSpent.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="mt-6 w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customer;