
import React, { useState, useMemo } from 'react';
import { AppState, ParcelEntry, Merchant, SiteType } from '../types';
import { Calculator, Download, Search, Filter, TrendingDown, DollarSign, Wallet } from 'lucide-react';

export const Accounts: React.FC<{ state: AppState }> = ({ state }) => {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const calculateMerchantSummary = (merchant: Merchant, entries: ParcelEntry[]) => {
    let totalCollected = 0;
    let totalDelivery = 0;
    let totalCODCharge = 0;
    let totalWeightCharge = 0;

    entries.forEach(entry => {
      const area = state.areas.find(a => a.id === entry.areaId);
      const site = area?.site || SiteType.OUTSIDE;
      
      const delivery = merchant.charges.delivery[site];
      const codPercent = merchant.charges.cod[site];
      const codCharge = (entry.amount * codPercent) / 100;
      const weightCharge = entry.weight > 1 ? (entry.weight - 1) * merchant.charges.weight[site] : 0;

      totalCollected += entry.amount;
      totalDelivery += delivery;
      totalCODCharge += codCharge;
      totalWeightCharge += weightCharge;
    });

    const netAmount = totalCollected - (totalDelivery + totalCODCharge + totalWeightCharge);

    return { totalCollected, totalDelivery, totalCODCharge, totalWeightCharge, netAmount };
  };

  const merchantSummaries = useMemo(() => {
    return state.merchants.map(m => {
      const entries = state.entries.filter(e => e.merchantId === m.id);
      return {
        merchant: m,
        ...calculateMerchantSummary(m, entries),
        parcelCount: entries.length
      };
    }).filter(s => selectedMerchantId === 'all' || s.merchant.id === selectedMerchantId);
  }, [state, selectedMerchantId]);

  const totals = merchantSummaries.reduce((acc, curr) => ({
    collected: acc.collected + curr.totalCollected,
    payable: acc.payable + curr.netAmount,
    revenue: acc.revenue + (curr.totalDelivery + curr.totalCODCharge + curr.totalWeightCharge)
  }), { collected: 0, payable: 0, revenue: 0 });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Accounts & Settlements</h1>
          <p className="text-gray-500">Financial tracking and merchant disbursements</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-lg shadow-yellow-100">
          <Download size={20} /> Download KISB File
        </button>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={24} /></div>
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Total Collected</p>
                <h3 className="text-2xl font-bold">৳{totals.collected.toLocaleString()}</h3>
             </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown size={24} /></div>
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase">RP Total Revenue</p>
                <h3 className="text-2xl font-bold text-red-600">৳{totals.revenue.toLocaleString()}</h3>
             </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-yellow-200">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Wallet size={24} /></div>
             <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Net Merchant Payable</p>
                <h3 className="text-2xl font-bold text-yellow-700">৳{totals.payable.toLocaleString()}</h3>
             </div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Filter:</span>
             </div>
             <select 
               value={selectedMerchantId} 
               onChange={e => setSelectedMerchantId(e.target.value)}
               className="px-4 py-2 bg-white border rounded-lg text-sm outline-none"
             >
                <option value="all">All Merchants</option>
                {state.merchants.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
             </select>
          </div>
          <div className="relative w-full md:w-64">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search merchant..." className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4 text-right">Parcels</th>
                <th className="px-6 py-4 text-right">Collected</th>
                <th className="px-6 py-4 text-right">Dlv. Fee</th>
                <th className="px-6 py-4 text-right">COD Fee</th>
                <th className="px-6 py-4 text-right">Wt. Fee</th>
                <th className="px-6 py-4 text-right text-yellow-700">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {merchantSummaries.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">No merchant data available.</td></tr>
              ) : (
                merchantSummaries.map(s => (
                  <tr key={s.merchant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{s.merchant.name}</div>
                      <div className="text-[10px] text-gray-400">{s.merchant.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{s.parcelCount}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">৳{s.totalCollected}</td>
                    <td className="px-6 py-4 text-right text-gray-500">- ৳{s.totalDelivery}</td>
                    <td className="px-6 py-4 text-right text-gray-500">- ৳{s.totalCODCharge.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-gray-500">- ৳{s.totalWeightCharge}</td>
                    <td className="px-6 py-4 text-right">
                       <span className="font-extrabold text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                         ৳{Math.floor(s.netAmount).toLocaleString()}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
