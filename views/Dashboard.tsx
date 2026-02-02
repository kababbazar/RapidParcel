
import React from 'react';
import { AppState } from '../types';
import { Package, Users, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const totalParcels = state.entries.length;
  const totalMerchants = state.merchants.length;
  const totalRevenue = state.entries.reduce((sum, e) => sum + e.amount, 0);
  
  const stats = [
    { label: 'Total Parcels', value: totalParcels, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Merchants', value: totalMerchants, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Coverage Areas', value: state.areas.length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Gross Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  // Dummy Chart Data
  const chartData = [
    { name: 'Sat', parcels: 12 },
    { name: 'Sun', parcels: 19 },
    { name: 'Mon', parcels: 15 },
    { name: 'Tue', parcels: 22 },
    { name: 'Wed', parcels: 30 },
    { name: 'Thu', parcels: 25 },
    { name: 'Fri', parcels: 18 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900">Operations Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of your logistics performance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Parcel Volume Trend
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">Weekly</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="parcels" radius={[6, 6, 0, 0]} barSize={35}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {state.entries.length === 0 ? (
              <p className="text-gray-400 text-sm italic text-center py-10">No recent activities found.</p>
            ) : (
              state.entries.slice(-5).reverse().map((entry, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 flex-shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Parcel #{entry.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{entry.customerName} • ৳{entry.amount}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
