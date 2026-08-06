'use client';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Orders', value: '1,234', change: '+12%', icon: '📦' },
    { label: 'Revenue', value: '₹45,230', change: '+8%', icon: '💰' },
    { label: 'Customers', value: '892', change: '+15%', icon: '👥' },
    { label: 'Avg. Order', value: '₹367', change: '+5%', icon: '📊' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <div className="flex gap-2">
          <select className="border rounded-lg px-3 py-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <span className="text-green-500 text-sm">{stat.change}</span>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}