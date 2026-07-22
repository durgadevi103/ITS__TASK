import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  BarChart2,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.fullName) setUserName(user.fullName);
        else if (user.email) setUserName(user.email.split("@")[0]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const stats = [
    {
      id: 1,
      name: "Total Revenue",
      value: "$54,320.00",
      change: "+14.5%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    {
      id: 2,
      name: "Active Users",
      value: "4,280",
      change: "+8.2%",
      isPositive: true,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    {
      id: 3,
      name: "Total Orders",
      value: "1,450",
      change: "+12.1%",
      isPositive: true,
      icon: ShoppingBag,
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    {
      id: 4,
      name: "Growth Rate",
      value: "98.4%",
      change: "-1.2%",
      isPositive: false,
      icon: TrendingUp,
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    },
  ];

  const recentTransactions = [
    { id: "TX1001", name: "Alex Morgan", email: "alex@example.com", amount: "$350.00", status: "Completed", date: "Just now" },
    { id: "TX1002", name: "Sophia Chen", email: "sophia@example.com", amount: "$1,200.00", status: "Completed", date: "25 mins ago" },
    { id: "TX1003", name: "Michael Reed", email: "michael@example.com", amount: "$84.50", status: "Pending", date: "1 hour ago" },
    { id: "TX1004", name: "Emma Watson", email: "emma@example.com", amount: "$620.00", status: "Completed", date: "3 hours ago" },
    { id: "TX1005", name: "David Kim", email: "david@example.com", amount: "$210.00", status: "Processing", date: "5 hours ago" },
  ];

  const performanceMetrics = [
    { label: "Direct Sales", percentage: 78, color: "bg-green-600" },
    { label: "Referral Revenue", percentage: 64, color: "bg-blue-600" },
    { label: "Social Campaigns", percentage: 42, color: "bg-purple-600" },
    { label: "Affiliate Network", percentage: 89, color: "bg-cyan-600" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)] bg-slate-50/50">

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide">
            <Activity className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>Live Performance Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold capitalize tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
            Here is what's happening with your business metrics and user performance today.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 self-start md:self-auto">
          <button className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-md text-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center gap-2 bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-xl transition border border-white/20 text-sm">
            <Plus className="w-4 h-4" />
            New Metric
          </button>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-40 top-0 w-32 h-32 bg-cyan-300/20 rounded-full blur-xl pointer-events-none" />
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.name}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color} transition group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </h3>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                    stat.isPositive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">vs. previous 30 days</p>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics & Performance Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Performance Progress Bars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-green-600" />
                Channel Performance & Growth
              </h2>
              <p className="text-xs text-gray-500 mt-1">Real-time revenue distribution breakdown</p>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Updated Live
            </span>
          </div>

          <div className="space-y-5">
            {performanceMetrics.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>{item.label}</span>
                  <span className="text-gray-900 font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Insights Cards inside Chart */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">Avg. Order Value</span>
              <span className="text-base font-bold text-gray-800">$124.50</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 block">Conversion Rate</span>
              <span className="text-base font-bold text-gray-800">4.85%</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-xs text-gray-500 block">Satisfaction</span>
              <span className="text-base font-bold text-emerald-600">99.2%</span>
            </div>
          </div>
        </motion.div>

        {/* System Health / Status Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                System Health
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-semibold text-emerald-900">API Gateway</div>
                    <div className="text-[11px] text-emerald-700">Operational (99.99%)</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">12ms</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs font-semibold text-blue-900">Database Server</div>
                    <div className="text-[11px] text-blue-700">Normal Load (24%)</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-700">Optimal</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-xs font-semibold text-purple-900">Security Firewall</div>
                    <div className="text-[11px] text-purple-700">Active Shielding</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700">Protected</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition text-sm shadow">
              <span>View System Logs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest order activities and processing status</p>
          </div>
          <button className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 self-start sm:self-auto">
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Transaction ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{tx.id}</td>
                  <td className="py-3.5 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{tx.name}</div>
                      <div className="text-xs text-gray-400">{tx.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">{tx.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : tx.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default Home;








