
import React, { useState } from 'react';
import { Merchant, SiteType, AppState } from '../types';
import { Plus, Trash2, Edit3, Download, Upload, Search, Phone, MapPin, DollarSign, Globe, Briefcase, User } from 'lucide-react';

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

  const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-700 transition-all font-medium placeholder:text-slate-400";
  const labelClasses = "text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-2";

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Merchant Network</h1>
          <p className="text-slate-500 font-medium">Manage your delivery partners and customized rate cards</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Download size={18} /> Export List
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-black hover:bg-yellow-600 shadow-xl shadow-yellow-100 transition-all">
             <Upload size={18} /> Bulk Onboard
           </button>
        </div>
      </header>

      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold mb-8 text-slate-800 flex items-center gap-3">
          <div className={`p-2 rounded-xl ${editingId ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
            {editingId ? <Edit3 size={24} /> : <Plus size={24} />}
          </div>
          {editingId ? 'Modify Merchant Details' : 'Onboard New Partner'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <label className={labelClasses}><Briefcase size={14} /> Legal Entity Name *</label>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required placeholder="Acme Logistics Ltd" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClasses}><User size={14} /> Trading / Page Name *</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required placeholder="Public Brand Name" value={formData.pageName || ''} onChange={e => setFormData({ ...formData, pageName: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClasses}><Phone size={14} /> Official Contact *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" required placeholder="017XXXXXXXX" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className={labelClasses}><MapPin size={14} /> Pickup / HQ Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Complete physical address for pickups" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputClasses} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClasses}><Globe size={14} /> Digital Presence</label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="url" placeholder="https://fb.com/brand" value={formData.pageLink || ''} onChange={e => setFormData({ ...formData, pageLink: e.target.value })} className={inputClasses} />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-8">
            <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <DollarSign size={18} className="text-yellow-500" /> Custom Rate Configurations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.values(SiteType).map((site) => (
                <div key={site} className="p-6 bg-slate-50/50 rounded-3xl space-y-5 border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">{site}</span>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-bold text-slate-600">Base Delivery</label>
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">৳</span>
                        <input type="number" value={formData.charges?.delivery[site] ?? 0} onChange={e => setFormData({...formData, charges: { ...formData.charges!, delivery: { ...formData.charges!.delivery, [site]: Number(e.target.value) } }})} className="w-full pl-6 pr-2 py-1.5 text-right text-xs font-bold border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-yellow-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-bold text-slate-600">COD Percent</label>
                      <div className="relative w-24">
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">%</span>
                        <input type="number" step="0.1" value={formData.charges?.cod[site] ?? 0} onChange={e => setFormData({...formData, charges: { ...formData.charges!, cod: { ...formData.charges!.cod, [site]: Number(e.target.value) } }})} className="w-full pl-2 pr-6 py-1.5 text-right text-xs font-bold border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-yellow-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-xs font-bold text-slate-600">Weight Surcharge</label>
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">৳</span>
                        <input type="number" value={formData.charges?.weight[site] ?? 0} onChange={e => setFormData({...formData, charges: { ...formData.charges!, weight: { ...formData.charges!.weight, [site]: Number(e.target.value) } }})} className="w-full pl-6 pr-2 py-1.5 text-right text-xs font-bold border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="px-8 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            )}
            <button type="submit" className="px-12 py-3.5 bg-yellow-500 text-white rounded-2xl font-black hover:bg-yellow-600 shadow-2xl shadow-yellow-100 transition-all active:scale-95">
              {editingId ? 'Commit Update' : 'Finalize Onboarding'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20">
          <h2 className="text-xl font-bold text-slate-800">Operational Partners ({state.merchants.length})</h2>
          <div className="relative w-full md:w-80">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Search partners..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-[10px] uppercase text-slate-400 font-black tracking-widest">
              <tr>
                <th className="px-6 py-5">Partner Data</th>
                <th className="px-6 py-5">Inside Dhaka Rate</th>
                <th className="px-6 py-5">Sub Area Rate</th>
                <th className="px-6 py-5">Outside Dhaka Rate</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredMerchants.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-medium italic">No registered partners found.</td></tr>
              ) : (
                filteredMerchants.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 text-base">{m.name}</div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1.5"><Phone size={12} className="text-slate-400" /> {m.phone}</div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-1 truncate max-w-[180px]"><MapPin size={12} className="text-slate-300" /> {m.address}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[10px] space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between font-bold"><span className="text-slate-400">DLV:</span> <span className="text-indigo-600">৳{m.charges.delivery[SiteType.INSIDE]}</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-400">COD:</span> <span className="text-emerald-600">{m.charges.cod[SiteType.INSIDE]}%</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-400">WT:</span> <span className="text-amber-600">৳{m.charges.weight[SiteType.INSIDE]}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[10px] space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between font-bold"><span className="text-slate-400">DLV:</span> <span className="text-indigo-600">৳{m.charges.delivery[SiteType.SUB]}</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-400">COD:</span> <span className="text-emerald-600">{m.charges.cod[SiteType.SUB]}%</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-400">WT:</span> <span className="text-amber-600">৳{m.charges.weight[SiteType.SUB]}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[10px] space-y-1 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between font-bold"><span className="text-slate-400">DLV:</span> <span className="text-indigo-600">৳{m.charges.delivery[SiteType.OUTSIDE]}</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-400">COD:</span> <span className="text-emerald-600">{m.charges.cod[SiteType.OUTSIDE]}%</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-400">WT:</span> <span className="text-amber-600">৳{m.charges.weight[SiteType.OUTSIDE]}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEdit(m)} className="p-3 bg-white text-blue-500 border border-slate-100 shadow-sm hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-3 bg-white text-red-500 border border-slate-100 shadow-sm hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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
