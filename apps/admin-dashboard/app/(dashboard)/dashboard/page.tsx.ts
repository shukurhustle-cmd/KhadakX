'use client';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const stats = [
    { label: 'Total Orders', value: '1,234', change: '+12%', icon: '📦' },
    { label: 'Revenue', value: '₹45,230', change: '+8%', icon: '💰' },
    { label: 'Customers', value: '892', change: '+15%', icon: '👥' },
    { label: 'Avg. Order', value: '₹367', change: '+5%', icon: '📊' },
  ];

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 3, 5, 2, 3, 15],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Revenue (₹)',
        data: [1200, 1900, 300, 500, 200, 300, 1500],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Dine-in', 'Takeaway', 'Delivery'],
    datasets: [
      {
        data: [300, 150, 100],
        backgroundColor: ['#FF6B35', '#0047AB', '#10B981'],
        borderWidth: 0,
      },
    ],
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">📈 Sales Trend</h2>
          <Line data={lineData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">📊 Order Types</h2>
          <div className="h-64">
            <Doughnut data={doughnutData} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Dine-in</span>
              <span className="font-semibold">300</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Takeaway</span>
              <span className="font-semibold">150</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span className="font-semibold">100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">📋 Recent Orders</h2>
          <button className="text-blue-600 text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-sm text-gray-500">Order ID</th>
                <th className="text-left py-3 text-sm text-gray-500">Customer</th>
                <th className="text-left py-3 text-sm text-gray-500">Amount</th>
                <th className="text-left py-3 text-sm text-gray-500">Status</th>
                <th className="text-left py-3 text-sm text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#ORD-001', customer: 'John Doe', amount: '₹450', status: 'Preparing', time: '5 min ago' },
                { id: '#ORD-002', customer: 'Jane Smith', amount: '₹280', status: 'Ready', time: '12 min ago' },
                { id: '#ORD-003', customer: 'Bob Johnson', amount: '₹890', status: 'Pending', time: '18 min ago' },
              ].map((order, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-mono text-sm">{order.id}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3 font-semibold">{order.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}