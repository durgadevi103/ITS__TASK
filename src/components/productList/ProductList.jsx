import React, { useState } from 'react';
import {
  Package,
  Plus,
  Grid,
  List,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  Layers,
  ShoppingBag,
  Star,
  Eye,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Buttoncomponent from '../resusedComponent/Buttoncomponent';
import Cards from '../cards/Cards';
import Searchbar from '../resusedComponent/Searchbar';

export const ProductList = () => {
  // Initial Mock Product Data
  const [products, setProducts] = useState([
    {
      id: "PRD-101",
      name: "Wireless Noise-Canceling Headphones",
      category: "Electronics",
      price: 199.99,
      stock: 45,
      status: "In Stock",
      rating: 4.8,
      sales: 320,
      sku: "ELC-HDP-001",
      color: "bg-indigo-500"
    },
    {
      id: "PRD-102",
      name: "Ergonomic Mechanical Keyboard",
      category: "Electronics",
      price: 129.50,
      stock: 12,
      status: "Low Stock",
      rating: 4.6,
      sales: 180,
      sku: "ELC-KBD-002",
      color: "bg-cyan-500"
    },
    {
      id: "PRD-103",
      name: "Ultra-Wide 4K Gaming Monitor",
      category: "Electronics",
      price: 499.99,
      stock: 0,
      status: "Out of Stock",
      rating: 4.9,
      sales: 95,
      sku: "ELC-MON-003",
      color: "bg-purple-500"
    },
    {
      id: "PRD-104",
      name: "Smart Fitness Watch V2",
      category: "Accessories",
      price: 89.99,
      stock: 85,
      status: "In Stock",
      rating: 4.4,
      sales: 450,
      sku: "ACC-WTC-004",
      color: "bg-emerald-500"
    },
    {
      id: "PRD-105",
      name: "Premium Leather Office Chair",
      category: "Furniture",
      price: 249.00,
      stock: 6,
      status: "Low Stock",
      rating: 4.7,
      sales: 75,
      sku: "FUR-CHR-005",
      color: "bg-amber-500"
    },
    {
      id: "PRD-106",
      name: "USB-C Multi-Port Adapter Hub",
      category: "Accessories",
      price: 45.00,
      stock: 120,
      status: "In Stock",
      rating: 4.5,
      sales: 610,
      sku: "ACC-HUB-006",
      color: "bg-blue-500"
    },
    {
      id: "PRD-107",
      name: "Minimalist Aluminum Desk Lamp",
      category: "Home & Office",
      price: 59.99,
      stock: 28,
      status: "In Stock",
      rating: 4.3,
      sales: 140,
      sku: "HOM-LMP-007",
      color: "bg-rose-500"
    },
    {
      id: "PRD-108",
      name: "High-Speed External Portable SSD 1TB",
      category: "Electronics",
      price: 119.99,
      stock: 0,
      status: "Out of Stock",
      rating: 4.8,
      sales: 290,
      sku: "ELC-SSD-008",
      color: "bg-teal-500"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Success Notification Toast State
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    sku: ""
  });

  // Calculate Dashboard Metrics
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stock > 10).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValuation = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  // Filter Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle Add Product Submit
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock, 10);
    const statusStr = stockNum === 0 ? "Out of Stock" : stockNum <= 10 ? "Low Stock" : "In Stock";
    const colors = ["bg-indigo-500", "bg-cyan-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];

    const createdProduct = {
      id: `PRD-${100 + products.length + 1}`,
      name: newProduct.name,
      category: newProduct.category,
      price: priceNum,
      stock: stockNum,
      status: statusStr,
      rating: 4.5,
      sales: 0,
      sku: newProduct.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setProducts([createdProduct, ...products]);
    setNewProduct({ name: "", category: "Electronics", price: "", stock: "", sku: "" });
    setIsModalOpen(false);

    // Show "Product added" success toast
    setToastMessage("Product added");
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Handle Delete Product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen relative">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white font-medium px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{toastMessage}</p>
                <p className="text-xs text-emerald-100">Item successfully saved to catalog.</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-cyan-600" />
            <span>Product List Dashboard</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your inventory, monitor stock levels, and analyze product sales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Buttoncomponent
            onClick={() => setIsModalOpen(true)}
            variant="Add New Product"
            icon={Plus}
          />
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Cards
          title="Total Items"
          value={totalProducts}
          trendText="Live Catalog"
          trendIcon={TrendingUp}
          icon={Layers}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <Cards
          title="In Stock"
          value={inStockCount}
          trendText="Ready for dispatch"
          trendIcon={CheckCircle}
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <Cards
          title="Low / Out of Stock"
          value={lowStockCount + outOfStockCount}
          trendText="Reorder required"
          trendIcon={AlertTriangle}
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          valueColor="text-amber-600"
          trendColor="text-amber-600"
        />

        <Cards
          title="Stock Valuation"
          value={`$${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trendText="Total Asset Value"
          trendIcon={DollarSign}
          icon={ShoppingBag}
          iconBg="bg-cyan-50"
          iconColor="text-cyan-600"
          trendColor="text-cyan-600"
        />
      </div>

      <Searchbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by product name or SKU..."
        statusValue={selectedCategory}
        onStatusChange={setSelectedCategory}
        statusOptions={[
          { value: "All", label: "All Categories" },
          { value: "Electronics", label: "Electronics" },
          { value: "Accessories", label: "Accessories" },
          { value: "Furniture", label: "Furniture" },
          { value: "Home & Office", label: "Home & Office" }
        ]}
        filterValue={selectedStatus}
        onFilterChange={setSelectedStatus}
        filterOptions={[
          { value: "All", label: "All Status" },
          { value: "In Stock", label: "In Stock" },
          { value: "Low Stock", label: "Low Stock" },
          { value: "Out of Stock", label: "Out of Stock" }
        ]}
      >
        {/* View Mode Toggle Button */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              viewMode === "table" ? "bg-white text-cyan-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              viewMode === "grid" ? "bg-white text-cyan-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </Searchbar>

      {/* Main Content Area: Table View or Grid View */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search query or filters.</p>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${p.color} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.rating} ({p.sales} sales)
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">{p.sku}</td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">${p.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{p.stock}</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.stock > 10 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                          p.status === "In Stock"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.status === "Low Stock"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === "In Stock"
                              ? "bg-emerald-500"
                              : p.status === "Low Stock"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProductDetails(p)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-cyan-600 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition"
                          title="Delete Product"
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
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      p.status === "In Stock"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : p.status === "Low Stock"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{p.sku}</span>
                </div>

                <div className={`w-14 h-14 rounded-2xl ${p.color} text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md`}>
                  {p.name.charAt(0)}
                </div>

                <h4 className="font-bold text-gray-900 line-clamp-1 mb-1">{p.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{p.category}</p>

                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="text-xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 font-medium">{p.stock} units left</span>
                </div>
              </div>

              <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {p.rating}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedProductDetails(p)}
                    className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-cyan-600 transition shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-600 transition shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
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
                <Package className="w-5 h-5 text-cyan-600" />
                Add New Product
              </h3>
              <p className="text-xs text-gray-500 mb-5">Fill in the product details to update your catalog.</p>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Smart Bluetooth Speaker"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Home & Office">Home & Office</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="99.99"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="50"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">SKU (Optional)</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="AUTO-GENERATED"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                    />
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
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProductDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100 text-center"
            >
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-16 h-16 rounded-2xl ${selectedProductDetails.color} text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg`}>
                {selectedProductDetails.name.charAt(0)}
              </div>

              <h3 className="text-xl font-bold text-gray-900">{selectedProductDetails.name}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedProductDetails.sku}</p>

              <div className="mt-5 p-4 bg-gray-50 rounded-2xl grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-xs text-gray-400 block">Category</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedProductDetails.category}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Price</span>
                  <span className="text-sm font-semibold text-gray-900">${selectedProductDetails.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Stock Level</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedProductDetails.stock} units</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Total Sales</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedProductDetails.sales} sold</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProductDetails(null)}
                className="mt-6 w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
