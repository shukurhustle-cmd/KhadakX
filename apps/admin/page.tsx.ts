'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const data = {
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Performance',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📊 Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold">156</p>
            <span className="text-green-500 text-sm">↑ 12%</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Revenue</p>
            <p className="text-3xl font-bold">₹45,230</p>
            <span className="text-green-500 text-sm">↑ 8%</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Active Tables</p>
            <p className="text-3xl font-bold">12</p>
            <span className="text-yellow-500 text-sm">● 4 waiting</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <Line options={options} data={data} height={100} />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">🧑‍🍳 Kitchen Orders</h2>
            <div className="space-y-2">
              <div className="flex justify-between border-b py-2">
                <span>#ORD-001</span>
                <span className="text-yellow-600">⏳ Preparing</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span>#ORD-002</span>
                <span className="text-blue-600">📋 Pending</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">🤖 AI Suggestions</h2>
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              "Try our new Butter Chicken - customers love it!"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}