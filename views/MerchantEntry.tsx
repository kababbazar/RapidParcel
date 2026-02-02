
import React, { useState } from 'react';
import { Merchant, SiteType, AppState } from '../types';
import { Plus, Trash2, Edit3, Download, Upload, Search, Phone, MapPin, DollarSign } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

export const MerchantEntry: React.FC<Props> = ({ state, updateState }) => {
  const [formData, setFormData] = useState<Partial<Merchant>>({
    charges: {
      delivery: { [SiteType.INSIDE]: 60, [SiteType.SUB]: 100, [SiteType.OUTSIDE]: 150 },
      cod: { [SiteType.INSIDE]: 0, [SiteType.SUB]: 1, [SiteType.OUTSIDE]: 1 },
      weight: { [SiteType.INSIDE]: 10, [SiteType.SUB]: 20, [SiteType.OUTSIDE]: 20 }
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pageName || !formData.phone) return;

    if (editingId) {
      const updated = state.merchants.map(m => m.id === editingId ? { ...formData, id: m.id } as Merchant : m);
      updateState({ merchants: updated });
      setEditingId(null);
    } else {
      const newMerchant: Merchant = {
        ...formData,
        id: `M-${Date.now()}`,
      } as Merchant;
      updateState({ merchants: [...state.merchants, newMerchant] });
    }
    setFormData({
      charges: {
        delivery: { [SiteType.INSIDE]: 60, [SiteType.SUB]: 100, [SiteType.OUTSIDE]: 150 },
        cod: { [SiteType.INSIDE]: 0, [SiteType.SUB]: 1, [SiteType.OUTSIDE]: 1 },
        weight: { [SiteType.INSIDE]: 10, [SiteType.SUB]: 20, [SiteType.OUTSIDE]: 20 }
      }
    });
  };

  const handleEdit = (m: Merchant) => {
    setFormData(m);
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this merchant?')) {
      updateState({ merchants: state.merchants.filter(m => m.id !== id) });
    }
  };

  const filteredMerchants = state.merchants.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Merchant Management</h1>
          <p className="text-gray-500">Register and manage your delivery partners</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
             <Download size={18} /> Export
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 shadow-sm transition-colors">
             <Upload size={18} /> Bulk Import
           </button>
        </div>
      </header>

      {/* Entry Form */}
      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          {editingId ? <Edit3 size={20} className="text-blue-500" /> : <Plus size={20} className="text-green-500" />}
          {editingId ? 'Edit Merchant Details' : 'Register New Merchant'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Merchant Name *</label>
              <input 
                type="text" required
                placeholder="e.g. Acme Fashion"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Page Name (for Invoice) *</label>
              <input 
                type="text" required
                placeholder="Display Name"
                value={formData.pageName || ''}
                onChange={e => setFormData({ ...formData, pageName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
              <input 
                type="tel" required
                placeholder="017XXXXXXXX"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Business Address</label>
              <input 
                type="text"
                placeholder="Full address"
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Page Link (Optional)</label>
              <input 
                type="url"
                placeholder="https://facebook.com/page"
                value={formData.pageLink || ''}
                onChange={e => setFormData({ ...formData, pageLink: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={16} /> Service Charges Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.values(SiteType).map((site) => (
                <div key={site} className="p-4 bg-gray-50 rounded-xl space-y-4 border">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{site}</span>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-medium text-gray-600">Delivery</label>
                      <input 
                        type="number"
                        value={formData.charges?.delivery[site] ?? 0}
                        onChange={e => setFormData({
                          ...formData, 
                          charges: { ...formData.charges!, delivery: { ...formData.charges!.delivery, [site]: Number(e.target.value) } }
                        })}
                        className="w-20 px-2 py-1 text-right text-sm border rounded focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-medium text-gray-600">COD (%)</label>
                      <input 
                        type="number" step="0.1"
                        value={formData.charges?.cod[site] ?? 0}
                        onChange={e => setFormData({
                          ...formData, 
                          charges: { ...formData.charges!, cod: { ...formData.charges!.cod, [site]: Number(e.target.value) } }
                        })}
                        className="w-20 px-2 py-1 text-right text-sm border rounded focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-medium text-gray-600">Weight/KG</label>
                      <input 
                        type="number"
                        value={formData.charges?.weight[site] ?? 0}
                        onChange={e => setFormData({
                          ...formData, 
                          charges: { ...formData.charges!, weight: { ...formData.charges!.weight, [site]: Number(e.target.value) } }
                        })}
                        className="w-20 px-2 py-1 text-right text-sm border rounded focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setFormData({}); }}
                className="px-6 py-2.5 rounded-xl border font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              className="px-10 py-2.5 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-lg shadow-yellow-200 transition-all transform active:scale-95"
            >
              {editingId ? 'Update Merchant' : 'Save Merchant'}
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Registered Merchants ({state.merchants.length})</h2>
          <div className="relative w-full md:w-64">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
              type="text"
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-yellow-500"
             />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">Merchant Information</th>
                <th className="px-6 py-4">Inside Dhaka</th>
                <th className="px-6 py-4">Sub Area</th>
                <th className="px-6 py-4">Outside Dhaka</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No merchants found.</td>
                </tr>
              ) : (
                filteredMerchants.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={12} /> {m.phone}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate max-w-[200px]"><MapPin size={12} /> {m.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between"><span>Del:</span> <span className="font-semibold">৳{m.charges.delivery[SiteType.INSIDE]}</span></div>
                        <div className="flex justify-between"><span>COD:</span> <span className="font-semibold">{m.charges.cod[SiteType.INSIDE]}%</span></div>
                        <div className="flex justify-between"><span>Wt:</span> <span className="font-semibold">৳{m.charges.weight[SiteType.INSIDE]}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between"><span>Del:</span> <span className="font-semibold">৳{m.charges.delivery[SiteType.SUB]}</span></div>
                        <div className="flex justify-between"><span>COD:</span> <span className="font-semibold">{m.charges.cod[SiteType.SUB]}%</span></div>
                        <div className="flex justify-between"><span>Wt:</span> <span className="font-semibold">৳{m.charges.weight[SiteType.SUB]}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between"><span>Del:</span> <span className="font-semibold">৳{m.charges.delivery[SiteType.OUTSIDE]}</span></div>
                        <div className="flex justify-between"><span>COD:</span> <span className="font-semibold">{m.charges.cod[SiteType.OUTSIDE]}%</span></div>
                        <div className="flex justify-between"><span>Wt:</span> <span className="font-semibold">৳{m.charges.weight[SiteType.OUTSIDE]}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
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
