
import React, { useState } from 'react';
import { Area, SiteType, AppState } from '../types';
import { Plus, Trash2, Edit3, Search, MapPin, Globe, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

export const AreaPanel: React.FC<Props> = ({ state, updateState }) => {
  const [formData, setFormData] = useState<Partial<Area>>({
    site: SiteType.INSIDE,
    homeDelivery: true
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district || !formData.areaName) return;

    if (editingId) {
      updateState({ areas: state.areas.map(a => a.id === editingId ? { ...formData, id: a.id } as Area : a) });
      setEditingId(null);
    } else {
      const newArea: Area = { ...formData, id: `A-${Date.now()}` } as Area;
      updateState({ areas: [...state.areas, newArea] });
    }
    setFormData({ site: SiteType.INSIDE, homeDelivery: true });
  };

  const filteredAreas = state.areas.filter(a => 
    a.areaName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900">Area Management</h1>
        <p className="text-gray-500">Define service regions and delivery capability</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <section className="bg-white p-6 rounded-2xl border shadow-sm sticky top-8">
            <h2 className="text-lg font-bold mb-6">{editingId ? 'Edit Area' : 'Add New Area'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Site Category</label>
                <select 
                  value={formData.site} 
                  onChange={e => setFormData({...formData, site: e.target.value as SiteType})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                >
                  {Object.values(SiteType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">District *</label>
                <input type="text" required value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="e.g. Dhaka" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Area Name *</label>
                <input type="text" required value={formData.areaName || ''} onChange={e => setFormData({...formData, areaName: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="e.g. Uttara Sector 4" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Post Code</label>
                <input type="text" value={formData.postCode || ''} onChange={e => setFormData({...formData, postCode: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="1230" />
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="homeDelivery" checked={formData.homeDelivery} onChange={e => setFormData({...formData, homeDelivery: e.target.checked})} className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500" />
                <label htmlFor="homeDelivery" className="text-sm font-semibold text-gray-700">Enable Home Delivery</label>
              </div>
              <div className="pt-4 flex gap-2">
                {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({});}} className="flex-1 px-4 py-2.5 border rounded-xl font-bold hover:bg-gray-50">Cancel</button>}
                <button type="submit" className="flex-2 px-6 py-2.5 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-lg shadow-yellow-100 transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> {editingId ? 'Update Area' : 'Save Area'}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
              <div className="relative w-full max-w-xs">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                  type="text" 
                  placeholder="Filter areas..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                />
              </div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{filteredAreas.length} Areas</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b text-[10px] uppercase font-bold text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Area & District</th>
                    <th className="px-6 py-4">Site Type</th>
                    <th className="px-6 py-4">Home Delivery</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredAreas.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No matching areas.</td></tr>
                  ) : (
                    filteredAreas.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{a.areaName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {a.district} {a.postCode && `(${a.postCode})`}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                            a.site === SiteType.INSIDE ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            a.site === SiteType.SUB ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            'bg-orange-50 text-orange-700 border-orange-100'
                          }`}>
                            {a.site}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           {a.homeDelivery ? <CheckCircle2 className="text-green-500" size={18} /> : <XCircle className="text-gray-300" size={18} />}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => {setEditingId(a.id); setFormData(a);}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                             <button onClick={() => updateState({ areas: state.areas.filter(x => x.id !== a.id) })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
      </div>
    </div>
  );
};
